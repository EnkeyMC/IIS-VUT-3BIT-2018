import React, { Component } from 'react';
import SidePanel from "./SidePanel";
import TicketList from "./TicketList";

export default class Main extends Component {
    render() {
        return (
            <div>
                <SidePanel/>
                <TicketList/>
            </div>
        );
    }
}