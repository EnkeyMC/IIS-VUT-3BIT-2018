import React, { Component } from 'react';
import { NavLink} from "react-router-dom";
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
    return (
        <NavLink to={props.match.path+'/'+props.bug.id}
                 activeClassName="selected"
                 className="list-group-item list-group-item-action flex-column align-items-start"
                 style={{borderLeft: '5px solid '+props.bug.severity.color}}
        >
            <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1 ticket-list-title">
                    {
                        props.bug.vulnerability ?
                            <>
                                <FontAwesomeIcon icon="exclamation-circle" id={"bug-"+props.bug.id} className="mr-1 text-danger" />
                                <UncontrolledTooltip placement="top" target={"bug-"+props.bug.id}>
                                    Vulnerability
                                </UncontrolledTooltip>
                            </>
                            :
                            null
                    }
                    {props.bug.title}
                </h6>
            </div>
            <small className="float-left">{props.bug.author}</small>
            <small className="float-right">{props.bug.created}</small>
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

function NewBugBtn() {
    return (
        <div className="float-right">
            <Button className="bg-red btn-red" id="createBugBtn"><FontAwesomeIcon icon="plus" /></Button>
            <UncontrolledTooltip placement="bottom" target="createBugBtn">
                Create New Bug
            </UncontrolledTooltip>
        </div>
    );
}