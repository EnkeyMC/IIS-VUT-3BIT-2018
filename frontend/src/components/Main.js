import React, { Component } from 'react';
import SidePanel from "./SidePanel";
import TicketList from "./TicketList";
import TicketInfo from "./TicketInfo";

export default class Main extends Component {
    render() {
        return (
            <div className="pt-header position-relative">
                <SidePanel/>
                <TicketList/>
                <TicketInfo/>
            </div>
        );
    }
}