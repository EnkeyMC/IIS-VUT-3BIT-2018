import React from "react";
import TicketList from "../components/TicketList";
import TicketInfo from "../components/TicketInfo";
import {Route, withRouter} from "react-router";
import {connect} from "react-redux";
import {getTickets, getUserTickets} from "../actions";
import Observable from "../utils/Observable";
import DefaultLayout from "./layouts/DefaultLayout";

export default class TicketView extends React.Component {
    constructor(props) {
        super(props);

        this.pathObservable = new Observable(this.props.match.path);
        this.pathObservable.setOnChanged(() => {
            this.updateTickets();
        });
    }

    componentDidMount() {
        this.pathObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.pathObservable.update(this.props.match.path);
    }

    updateTickets() {
        if (this.props.match.path.endsWith('/new'))
            this.props.getTickets('new');
        else if (this.props.match.path.endsWith('/closed'))
            this.props.getTickets('closed');
        else if (this.props.match.path.endsWith('/my'))
            this.props.getUserTickets(this.props.username);
        else
            this.props.getTickets();
    }

    render () {
        let defaultId = null;
        const data = this.props.tickets.data;
        if (data && data.length > 0)
            defaultId = data[0].id;

        return (
            <DefaultLayout>
                <TicketList tickets={this.props.tickets} />
                <Route path={this.props.match.path+'/:ticketId?'} render={(props) => <TicketInfo defaultId={defaultId} {...props} />} />
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
            getTickets: (status = null) => dispatch(getTickets(status)),
            getUserTickets: (username) => dispatch(getUserTickets(username))
        }
    }
)(withRouter(TicketView));