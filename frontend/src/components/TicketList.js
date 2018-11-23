import React, { Component } from 'react';
import {Link, NavLink} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Input, Button, UncontrolledTooltip, Label} from 'reactstrap';
import {StateRenderer} from "../utils";
import {withRouter} from "react-router";

export default class TicketList extends Component {
    render() {
        const tickets = this.props.tickets;

        return (
            <div className="ticket-list content-height position-fixed">
                <Select/>
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

function Select() {
    return (
        <div className="w-100 p-2 select">
            <small><Label for="order-select" className="text-muted d-block">Ordering</Label></small>
            <Input type="select" name="select" id="order-select" className="d-inline-block">
                <option>Most recent</option>
                <option>Oldest</option>
                <option>User A-Z</option>
                <option>User Z-A</option>
            </Input>
            <NewTicketBtn/>
        </div>
    );
}

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


