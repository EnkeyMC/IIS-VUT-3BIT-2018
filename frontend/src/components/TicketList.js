import React, { Component } from 'react';
import {connect} from "react-redux";
import {getTickets} from "../actions";

export default class TicketList extends Component {
    componentDidMount() {
        this.props.getTickets();
    }

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

TicketList = connect(
    state => {
        return { tickets: state.ticketView.tickets }
    },
    dispatch => {
        return {
            getTickets: () => dispatch(getTickets())
        }
    }
)(TicketList);

function Ticket(props) {
    return (
        <a href="#" className={"list-group-item list-group-item-action flex-column align-items-start state-" + props.ticket.status}>
            <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">{props.ticket.title}</h6>
            </div>
            <small className="float-left">No user yet</small>
            <small className="float-right">{props.ticket.created}</small>
        </a>
    );
}



