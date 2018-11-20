import React, { Component } from 'react';
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup, Label, Input, Button, UncontrolledTooltip } from 'reactstrap';

export default class TicketList extends Component {
    render() {
        return (
            <div className="ticket-list content-height position-fixed">
                <Select/>
                <div className="list-group">
                    {this.props.tickets.data.map(ticket => {
                        return <Ticket key={ticket.id} ticket={ticket} />;
                    })}
                </div>
            </div>
        );
    }
}

function Ticket(props) {
    return (
        <Link to={"/ticket/"+props.ticket.id} className={"list-group-item list-group-item-action flex-column align-items-start state-" + props.ticket.status}>
            <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1 ticket-list-title">#{props.ticket.id} - {props.ticket.title}</h6>
            </div>
            <Link to={"/profile/"+props.ticket.author}><small className="float-left">{props.ticket.author}</small></Link>
            <small className="float-right">{props.ticket.created}</small>
        </Link>
    );
}

function Select(props) {
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

function NewTicket(props) {
    return (
        <div className="mr-2 float-right">
            <Button className="bg-red" id="createBtn"><FontAwesomeIcon icon="plus" size="md"/></Button>
            <UncontrolledTooltip placement="bottom" target="createBtn">
                Create New Ticket
            </UncontrolledTooltip>
        </div>
    );
}


