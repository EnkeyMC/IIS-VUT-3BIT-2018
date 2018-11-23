import React from "react";
import Header from '../components/Header';
import SidePanel from "../components/SidePanel";
import BugList from "../components/BugList";
import BugInfo from "../components/BugInfo";
import {Route} from "react-router";

export default class BugView extends React.Component {
    render () {

        return (
            <div>
                <Header />
                <div className="pt-header position-relative">
                    <SidePanel/>
                    <BugList />
                    <BugInfo />
                </div>
            </div>
        )
    }
}