import React, { Component } from 'react';
import { NavLink} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup, Input, Button, UncontrolledTooltip } from 'reactstrap';
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
                <h6 className="mb-1 ticket-list-title">#{props.ticket.id} - {props.ticket.title}</h6>
            </div>
            <small className="float-left">{props.ticket.author}</small>
            <small className="float-right">{props.ticket.created}</small>
        </NavLink>
    );
});

function Select() {
    return (
        <div className="w-100 pl-2 select">
            <FormGroup className="d-inline-block w-75">
                {/*<Label for="exampleSelect">Order</Label>*/}
                <Input type="select" name="select" id="exampleSelect">
                    <option>Most recent</option>
                    <option>Oldest</option>
                    <option>User A-Z</option>
                    <option>User Z-A</option>
                </Input>
            </FormGroup>
            <NewTicket/>
        </div>
    );
}

function NewTicket() {
    return (
        <div className="mr-2 float-right">
            <Button className="bg-red btn-red" id="createTicketBtn"><FontAwesomeIcon icon="plus" /></Button>
            <UncontrolledTooltip placement="bottom" target="createTicketBtn">
                Create New Ticket
            </UncontrolledTooltip>
        </div>
    );
}


