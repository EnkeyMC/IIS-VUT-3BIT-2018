import React, { Component } from 'react';
import SidePanel from "./SidePanel";
import BugList from "./BugList";

export default class Main extends Component {
    render() {
        return (
            <div>
                <SidePanel/>
                <BugList/>
            </div>
        );
    }
}