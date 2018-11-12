import React, { Component } from 'react';
import {connect} from "react-redux";
import {getTickets} from "../actions";
import {Link} from "react-router-dom";
import {Redirect, withRouter} from "react-router";

export default class TicketList extends Component {
    componentDidMount() {
        this.props.getTickets();
    }

    render() {
        if (this.props.match.path === '/ticket' && this.props.tickets.data.length > 0)
            return <Redirect to={'/ticket/'+this.props.tickets.data[0].id} />;

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
)(withRouter(TicketList));

function Ticket(props) {
    return (
        <Link to={"/ticket/"+props.ticket.id} className={"list-group-item list-group-item-action flex-column align-items-start state-" + props.ticket.status}>
            <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1 ticket-list-title">#{props.ticket.id} {props.ticket.title}</h6>
            </div>
            <small className="float-left">{props.ticket.author}</small>
            <small className="float-right">{props.ticket.created}</small>
        </Link>
    );
}



