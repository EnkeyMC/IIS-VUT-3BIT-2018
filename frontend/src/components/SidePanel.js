import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {NavLink} from 'react-router-dom';
import {RestrictedView, ROLE_USER} from "./RoleRestriction";

export default class SidePanel extends Component {
    render() {
        return (
            <nav className="position-fixed side-panel content-height">
                <PanelLink to="/tickets/all" icon="boxes" label="All tickets" margin="mt-4"/>
                <PanelLink to="/tickets/new" icon="box-open" label="New tickets" margin="mt-0"/>
                <PanelLink to="/tickets/new" icon="people-carry" label="Assigned tickets" margin="mt-0"/>
                <PanelLink to="/tickets/closed" icon="box" label="Closed tickets" margin="mt-0"/>
                <RestrictedView minRole={ROLE_USER}>
                    <PanelLink to="/tickets/my" icon="user" label="My tickets" margin="mt-0"/>
                </RestrictedView>
                <PanelLink to="/bugs" icon="bug" label="Bugs" margin="mt-5"/>
                <PanelLink to="/modules" icon="clone" label="Modules" margin="mt-0"/>
            </nav>
        );
    }
}

function PanelLink(props) {
    return (
        <NavLink to={props.to} className={"d-block w100 side-container " + props.margin}>
            <div className="icon-text flex-mid">
                {props.label}
            </div>
            <div className="flex-mid side-icon">
                <FontAwesomeIcon icon={props.icon} />
            </div>
        </NavLink>
    );
}