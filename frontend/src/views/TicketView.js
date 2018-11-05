import React from "react";
import Header from '../components/Header';
import Main from '../components/Main';

export default class TicketView extends React.Component {
    render () {
        console.log(this.props.match);
        return (
            <div>
                <Header />
                <Main />
            </div>
        )
    }
}