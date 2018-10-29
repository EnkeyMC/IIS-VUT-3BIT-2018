import React, { Component } from 'react';
// import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

export default class TicketList extends Component {
    render() {
        return (
            <div className="bug-list border-right">
                <div className="list-group">
                    <Ticket title="Title 1" user="Jan Novák" time="1.1.1992" ticketState="state-open" />
                    <Ticket title="Title 2" user="Roman Left" time="12.8.2002" ticketState="state-close" />
                    <Ticket title="Title 3" user="Marek Haz" time="8.6.1989" ticketState="state-open" />
                    <Ticket title="Title 4" user="Alena Black" time="7.12.1989" ticketState="state-open" />
                    <Ticket title="Title 5" user="Katerine Smith" time="9.6.1989" ticketState="state-close" />
                    <Ticket title="Title 6" user="Marek Haz" time="10.10.2009" ticketState="state-close" />
                </div>
            </div>
        );
    }
}

function Ticket(props) {
    return (
        <a href="#" className={"list-group-item list-group-item-action flex-column align-items-start " + props.ticketState}>
            <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">{props.title}</h6>
            </div>
            <small className="float-left">{props.user}</small>
            <small className="float-right">{props.time}</small>
        </a>
    );
}



