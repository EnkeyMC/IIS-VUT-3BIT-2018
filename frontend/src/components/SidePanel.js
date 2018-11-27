import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {NavLink} from 'react-router-dom';

export default class SidePanel extends Component {
    render() {
        return (
            <nav className="position-fixed side-panel content-height">
                <PanelLink to="/tickets" label="Tickets" margin="mt-5">
                    <FontAwesomeIcon icon="receipt"/>
                </PanelLink>
                <PanelLink to="/bugs" label="Bugs" margin="mt-2">
                    <FontAwesomeIcon icon="bug"/>
                </PanelLink>
                <PanelLink to="/modules" label="Modules" margin="mt-2">
                    <FontAwesomeIcon icon="clone" />
                </PanelLink>
                <PanelLink to="/patches" label="Patches" margin="mt-2">
                    <FontAwesomeIcon icon="band-aid"/>
                </PanelLink>
            </nav>
        );
    }
}

function PanelLink(props) {
    return (
        <NavLink to={props.to} className={"d-block w100 side-container " + props.margin}>
            <div className="icon-text">
                {props.label}
            </div>
            <div className="flex-mid side-icon">
                {props.children}
            </div>
        </NavLink>
    );
}