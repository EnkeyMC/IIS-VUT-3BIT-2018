import React, { Component } from 'react';
import {Link, NavLink} from "react-router-dom";
import {Input, Button, UncontrolledTooltip, Label} from 'reactstrap';
import {withRouter} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {StateRenderer} from "../utils";
import {RestrictedView, ROLE_PROGRAMMER} from "./RoleRestriction";

export default class BugList extends Component {
    render() {
        return (
            <div className="ticket-list content-height position-fixed">
                <OrderSelect/>
                <div className="list-group">
                    <StateRenderer state={this.props.bugs} renderCondition={this.props.bugs.data !== null}>
                        {props => {
                            if (props.data.length === 0) {
                                return <div className="flex-mid mt-3 mb-3">No tickets found</div>;
                            } else {
                                return props.data.map(bug => <Bug key={bug.id} bug={bug} />);
                            }
                        }}
                    </StateRenderer>
                </div>
            </div>
        );
    }
}

const Bug = withRouter((props) => {
    const bug = props.bug;
    return (
        <NavLink to={props.match.path+'/'+bug.id}
                 activeClassName="selected"
                 className="list-group-item list-group-item-action flex-column align-items-start"
                 style={bug.severity ? {borderLeft: '5px solid '+bug.severity.color} : null}
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

function OrderSelect() {
    return (
        <div className="w-100 p-2 select">
            <small><Label for="order-select" className="text-muted d-block">Ordering</Label></small>
            <Input type="select" name="select" id="order-select" className="d-inline-block">
                <option>Most recent</option>
                <option>Oldest</option>
                <option>User A-Z</option>
                <option>User Z-A</option>
            </Input>
            <RestrictedView minRole={ROLE_PROGRAMMER}>
                <NewBugBtn />
            </RestrictedView>
        </div>
    );
}

const NewBugBtn = withRouter((props) => {
    return (
        <div className="float-right">
            <Button tag={Link} to={props.match.path+'/create'} className="bg-red btn-red" id="createBugBtn"><FontAwesomeIcon icon="plus" /></Button>
            <UncontrolledTooltip placement="bottom" target="createBugBtn">
                Create New Bug
            </UncontrolledTooltip>
        </div>
    );
});