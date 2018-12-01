import React from "react";
import TicketInfo from "../components/TicketInfo";
import {Route, Switch, withRouter} from "react-router";
import {connect} from "react-redux";
import {getTickets} from "../actions/tickets";
import Observable from "../utils/Observable";
import DefaultLayout from "./layouts/DefaultLayout";
import TicketCreate from "../components/TicketCreate";
import {RestrictedRoute, RestrictedView, ROLE_USER} from "../components/RoleRestriction";
import SideList, {NewItemBtn, SideListFilter, SideListFilterItem, SideListHeader} from "../components/SideList";
import pathToRegexp from "path-to-regexp";
import {NavLink} from "react-router-dom";
import {appendToPath} from "../utils";
import TicketEdit from "../components/TicketEdit";

export default class TicketView extends React.Component {
    constructor(props) {
        super(props);

        this.pathObservable = new Observable(this.props.match.params.status);
        this.pathObservable.setOnChanged(() => {
            this.updateTickets();
        });
        this.pathObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.pathObservable.update(this.props.match.params.status);
    }

    updateTickets() {
        const status = this.props.match.params.status;
        if (!status || status === 'all')
            this.props.getTickets();
        else if (status === 'my')
            this.props.getTickets({username: this.props.username});
        else
            this.props.getTickets({status: status});
    }

    render () {
        let defaultId = null;
        const data = this.props.tickets.data;
        if (data && data.length > 0)
            defaultId = data[0].id;

        const toPath = pathToRegexp.compile(this.props.match.path);
        const path = toPath({status: this.props.match.params.status});

        const routeParams = {
            path: this.props.match.path+'/:id(\\d+)?',
            render: (props) => <TicketInfo defaultId={defaultId} {...props} />
        };

        return (
            <DefaultLayout>
                <SideList list={this.props.tickets} noItems="No tickets found" itemTag={Ticket}>
                    <SideListHeader
                        title="Tickets"
                        filter={
                            <SideListFilter value={this.props.match.params.status} defaultValue="all">
                                <SideListFilterItem linkTo="/tickets/all" value="all" />
                                <SideListFilterItem linkTo="/tickets/new" value="new" />
                                <SideListFilterItem linkTo="/tickets/assigned" value="assigned" />
                                <SideListFilterItem linkTo="/tickets/closed" value="closed" />
                                <RestrictedView minRole={ROLE_USER}>
                                    <SideListFilterItem linkTo="/tickets/my" value="my" />
                                </RestrictedView>
                            </SideListFilter>
                        }

                        newBtn={
                            <NewItemBtn linkTo={path+'/create'}>
                                Create New Ticket
                            </NewItemBtn>
                        }
                    />
                </SideList>
                <Switch>
                    <RestrictedRoute minRole={ROLE_USER} path={this.props.match.path+'/create'} component={TicketCreate} />
                    <Route path={this.props.match.path+'/:id/edit'} component={TicketEdit} />
                    {
                        this.props.match.params.status === 'my' ?
                            <RestrictedRoute minRole={ROLE_USER} {...routeParams} />
                            :
                            <Route {...routeParams} />
                    }
                </Switch>
            </DefaultLayout>
        )
    }
}

TicketView = connect(
    state => {
        return {
            tickets: state.ticketView.tickets,
            username: state.global.user ? state.global.user.username : null
        }
    },
    dispatch => {
        return {
            getTickets: (status = null) => dispatch(getTickets(status))
        }
    }
)(withRouter(TicketView));

const Ticket = withRouter((props) => {
    const toPath = pathToRegexp.compile(props.match.path);
    return (
        <NavLink to={appendToPath(toPath({status: props.match.params.status}), props.item.id)} activeClassName="selected" className={"list-group-item list-group-item-action flex-column align-items-start state-" + props.item.status}>
            <div className="d-flex w-100 justify-content-between">
                <h6 className="pb-1 ticket-list-title">#{props.item.id} - {props.item.title}</h6>
            </div>
            <small className="float-left">{props.item.author}</small>
            <small className="float-right">{props.item.created}</small>
        </NavLink>
    );
});