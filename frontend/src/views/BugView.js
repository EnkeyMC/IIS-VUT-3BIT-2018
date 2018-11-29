import React from "react";
import BugInfo from "../components/BugInfo";
import DefaultLayout from "./layouts/DefaultLayout";
import {Route, Switch, withRouter} from "react-router";
import {connect} from "react-redux";
import {getBugs} from "../actions";
import Observable from "../utils/Observable";
import {RestrictedRoute, RestrictedView, ROLE_PROGRAMMER} from "../components/RoleRestriction";
import BugCreate from "../components/BugCreate";
import SideList, {NewItemBtn, SideListHeader} from "../components/SideList";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {UncontrolledTooltip} from "reactstrap";

export default class BugView extends React.Component {
    constructor(props) {
        super(props);

        this.pathObservable = new Observable(this.props.match.path);
        this.pathObservable.setOnChanged(() => {
            this.props.getBugs();
        });
        this.pathObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.pathObservable.update(this.props.match.path);
    }

    render () {
        let defaultId = null;
        const data = this.props.bugs.data;
        if (data && data.length > 0)
            defaultId = data[0].id;

        return (
            <DefaultLayout>
                <SideList list={this.props.bugs} noItems="No bugs found" itemTag={Bug}>
                    <SideListHeader
                        title="Bug list"

                        newBtn={
                            <RestrictedView minRole={ROLE_PROGRAMMER}>
                                <NewItemBtn linkTo={this.props.match.path+'/create'}>
                                    Create New Bug
                                </NewItemBtn>
                            </RestrictedView>
                        }
                    />
                </SideList>
                <Switch>
                    <RestrictedRoute minRole={ROLE_PROGRAMMER} path={this.props.match.path+'/create'} component={BugCreate} />
                    <Route path={this.props.match.path+'/:id(\\d+)?'} render={(props) => <BugInfo defaultId={defaultId} {...props} />} />
                </Switch>
            </DefaultLayout>
        )
    }
}

BugView = connect(
    state => {
        return {
            bugs: state.bugView.bugs
        }
    },
    dispatch => {
        return {
            getBugs: () => dispatch(getBugs())
        }
    }
)(withRouter(BugView));

const Bug = withRouter((props) => {
    const bug = props.item;
    return (
        <NavLink to={props.match.path+'/'+bug.id}
                 activeClassName="selected"
                 className="list-group-item list-group-item-action flex-column align-items-start"
                 style={bug.severity ?
                     {borderLeft: '5px solid '+bug.severity.color}
                     :
                     {borderLeft: '5px solid transparent'}}
        >
            <div className="d-flex w-100 justify-content-between">
                <h6 className="pb-1 ticket-list-title">
                    {
                        bug.vulnerability ?
                            <>
                                <FontAwesomeIcon icon="exclamation-circle" id={"bug-"+bug.id} className="mr-1 text-danger" />
                                <UncontrolledTooltip placement="top" target={"bug-"+bug.id}>
                                    Vulnerability
                                </UncontrolledTooltip>
                            </>
                            :
                            null
                    }
                    #{bug.id} - {bug.title}
                </h6>
            </div>
            <small className="float-left">{bug.author}</small>
            <small className="float-right">{bug.created}</small>
        </NavLink>

    );
});