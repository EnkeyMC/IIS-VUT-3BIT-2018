import React from "react";
import Header from '../components/Header';
import Profile from "../components/Profile";

export default class ProfileView extends React.Component {
    render () {
        return (
            <div>
                <Header />
                <div className="pt-header position-relative">
                    <Profile/>
                </div>
            </div>
        )
    }
}