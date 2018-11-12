import React from "react";
import Header from '../components/Header';
import SidePanel from "../components/SidePanel";
import TicketList from "../components/TicketList";
import TicketInfo from "../components/TicketInfo";
import {Route, withRouter} from "react-router";
import connect from "react-redux/es/connect/connect";
import {getTickets} from "../actions";

export default class TicketView extends React.Component {
    componentDidMount() {
        this.props.getTickets();
    }

    render () {
        let defaultId = null;
        if (this.props.tickets.data.length > 0)
            defaultId = this.props.tickets.data.length;

        return (
            <div>
                <Header />
                <div className="pt-header position-relative">
                    <SidePanel/>
                    <TicketList tickets={this.props.tickets}/>
                    <Route path={this.props.match.path+'/:ticketId?'} render={(props) => <TicketInfo defaultId={defaultId} {...props} />} />
                </div>
            </div>
        )
    }
}

TicketView = connect(
    state => {
        return { tickets: state.ticketView.tickets }
    },
    dispatch => {
        return {
            getTickets: () => dispatch(getTickets())
        }
    }
)(withRouter(TicketView));