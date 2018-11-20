import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default class SidePanel extends Component {
    render() {
        return (
            <nav className="position-fixed side-panel content-height">
                <Icon icon="boxes" label="All tickets" margin="mt-4"/>
                <Icon icon="box-open" label="Opened tickets" margin="mt-0"/>
                <Icon icon="box" label="Closed tickets" margin="mt-0"/>
                <Icon icon="user" label="My tickets" margin="mt-0"/>
                <Icon icon="bug" label="Bugs" margin="mt-5"/>
                <Icon icon="clone" label="Modules" margin="mt-0"/>
            </nav>
        );
    }
}

function Icon(props) {
    return (
        <div className={"w100 side-container " + props.margin}>
            <div className="icon-text flex-mid">
                {props.label}
            </div>
            <div className="flex-mid side-icon">
                <FontAwesomeIcon icon={props.icon} />
            </div>
        </div>
    );
}