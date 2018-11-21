import React from "react";
import Header from '../components/Header';
import SidePanel from "../components/SidePanel";
import TicketList from "../components/TicketList";
import TicketInfo from "../components/TicketInfo";
import {Route, withRouter} from "react-router";
import {connect} from "react-redux";
import {getTickets, getUserTickets} from "../actions";

export default class TicketView extends React.Component {
    constructor(props) {
        super(props);

        this._lastPath = this.props.match.path;
    }


    componentDidMount() {
        this.updateTickets();
    }

    componentDidUpdate() {
        if (this._lastPath !== this.props.match.path) {
            this._lastPath = this.props.match.path;
            this.updateTickets()
        }
    }

    updateTickets() {
        if (this.props.match.path.endsWith('/open'))
            this.props.getTickets('open');
        else if (this.props.match.path.endsWith('/closed'))
            this.props.getTickets('closed');
        else if (this.props.match.path.endsWith('/my'))
            this.props.getUserTickets(this.props.username);
        else
            this.props.getTickets();
    }

    render () {
        let defaultId = null;
        if (this.props.tickets.data.length > 0)
            defaultId = this.props.tickets.data[0].id;

        return (
            <div>
                <Header />
                <div className="pt-header position-relative">
                    <SidePanel/>
                    <TicketList tickets={this.props.tickets} />
                    <Route path={this.props.match.path+'/:ticketId?'} render={(props) => <TicketInfo defaultId={defaultId} {...props} />} />
                </div>
            </div>
        )
    }
}

TicketView = connect(
    state => {
        return {
            tickets: state.ticketView.tickets,
            username: state.global.user ? state.global.user.username : null
        }
    },
    dispatch => {
        return {
            getTickets: (status = null) => dispatch(getTickets(status)),
            getUserTickets: (username) => dispatch(getUserTickets(username))
        }
    }
)(withRouter(TicketView));