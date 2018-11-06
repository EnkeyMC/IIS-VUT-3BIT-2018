import React from "react";
import Header from '../components/Header';
import SidePanel from "../components/SidePanel";
import TicketList from "../components/TicketList";
import TicketInfo from "../components/TicketInfo";
import {Route} from "react-router";

export default class TicketView extends React.Component {
    render () {
        return (
            <div>
                <Header />
                <div className="pt-header position-relative">
                    <SidePanel/>
                    <TicketList/>
                    <Route path={this.props.match.path+'/:ticketId'} component={TicketInfo} />
                </div>
            </div>
        )
    }
}