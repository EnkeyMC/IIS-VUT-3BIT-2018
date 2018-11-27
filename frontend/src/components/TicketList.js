import React, { Component } from 'react';
import {Link, NavLink} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Input, Button, UncontrolledTooltip, Label, UncontrolledDropdown,
    DropdownMenu, DropdownToggle, DropdownItem
} from 'reactstrap';
import {StateRenderer} from "../utils";
import {withRouter} from "react-router";
import {RestrictedView, ROLE_USER} from "./RoleRestriction";

export default class TicketList extends Component {
    render() {
        const tickets = this.props.tickets;

        return (
            <div className="ticket-list content-height position-fixed">
                <OrderSelect/>
                <div className="list-group">
                    <StateRenderer state={this.props.tickets}>
                        {
                            tickets.data && tickets.data.length === 0 ?
                                <div className="flex-mid mt-3 mb-3">
                                    No tickets found
                                </div>
                                :
                            tickets.data ?
                                tickets.data.map(ticket => {
                                    return <Ticket key={ticket.id} ticket={ticket} />;
                                })
                                :
                                null
                        }
                    </StateRenderer>
                </div>
            </div>
        );
    }
}

const Ticket = withRouter((props) => {
    return (
        <NavLink to={props.match.path+'/'+props.ticket.id} activeClassName="selected" className={"list-group-item list-group-item-action flex-column align-items-start state-" + props.ticket.status}>
            <div className="d-flex w-100 justify-content-between">
                <h6 className="pb-1 ticket-list-title">#{props.ticket.id} - {props.ticket.title}</h6>
            </div>
            <small className="float-left">{props.ticket.author}</small>
            <small className="float-right">{props.ticket.created}</small>
        </NavLink>
    );
});

function OrderSelect() {
    return (
        <div className="w-100 p-2 select">
            <div>
                <h3 className="d-inline-block">Ticket List</h3>
                <Filter />
                <NewTicketBtn />
            </div>
            <small><Label for="order-select" className="text-muted d-block">Ordering</Label></small>
            <Input type="select" name="select" id="order-select" className="d-inline-block">
                <option>Most recent</option>
                <option>Oldest</option>
                <option>User A-Z</option>
                <option>User Z-A</option>
            </Input>
        </div>
    );
}

class Filter extends Component {
    constructor(props) {
        super(props);

        this.state = { txt: 'all' };

        this.handleName = this.handleName.bind(this);
    }

    handleName(event) {
        this.setState({txt: event.target.innerHTML})
    }

    render() {
        return (
            <UncontrolledDropdown setActiveFromChild className="d-inline">
                <DropdownToggle tag="a" className="nav-link pointer d-inline pr-0" caret>
                    {this.state.txt}
                </DropdownToggle>
                <DropdownMenu className="dropdown-link">
                    <NavLink to="/tickets">
                        <DropdownItem className="pointer" onClick={this.handleName}>all</DropdownItem>
                    </NavLink>
                    <NavLink to="/tickets/new">
                        <DropdownItem className="pointer" onClick={this.handleName}>new</DropdownItem>
                    </NavLink>
                    <NavLink to="/tickets/assigned">
                        <DropdownItem className="pointer" onClick={this.handleName}>assigned</DropdownItem>
                    </NavLink>
                    <NavLink to="/tickets/closed">
                        <DropdownItem className="pointer" onClick={this.handleName}>closed</DropdownItem>
                    </NavLink>
                    <RestrictedView minRole={ROLE_USER}>
                        <NavLink to="/tickets/my">
                            <DropdownItem className="pointer" onClick={this.handleName}>my</DropdownItem>
                        </NavLink>
                    </RestrictedView>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}

Filter = withRouter(Filter);

const NewTicketBtn = withRouter((props) => {
    return (
        <div className="float-right">
            <Button tag={Link} to={props.match.path+'/create'} className="bg-red btn-red" id="createTicketBtn"><FontAwesomeIcon icon="plus" /></Button>
            <UncontrolledTooltip placement="bottom" target="createTicketBtn">
                Create New Ticket
            </UncontrolledTooltip>
        </div>
    );
});


