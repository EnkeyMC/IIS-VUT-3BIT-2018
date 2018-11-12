import React, { Component } from 'react';
import {Link} from "react-router-dom";

export default class TicketList extends Component {
    render() {
        return (
            <div className="ticket-list border-right content-height position-fixed">
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
            <small className="float-left">{props.ticket.author}</small>
            <small className="float-right">{props.ticket.created}</small>
        </Link>
    );
}



