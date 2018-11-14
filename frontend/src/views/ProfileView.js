import React from "react";
import Header from '../components/Header';
import Profile from "../components/Profile";
import {Route} from "react-router";

export default class ProfileView extends React.Component {
    render () {
        return (
            <div>
                <Header />
                <div className="pt-header position-relative">
                    <Route path="/profile/:userId?" component={Profile} />
                </div>
            </div>
        )
    }
}