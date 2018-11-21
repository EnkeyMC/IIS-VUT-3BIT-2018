import React from "react";
import Header from '../components/Header';
import Profile from "../components/Profile";
import {Route} from "react-router";
import SidePanel from "../components/SidePanel";

export default class ProfileView extends React.Component {
    render () {
        return (
            <div>
                <Header />
                <div className="pt-header position-relative">
                    <SidePanel/>
                    <div className="position-relative content-height">
                        <Route path="/profile/:username?" component={Profile} />
                    </div>
                </div>
            </div>
        )
    }
}