import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {NavLink} from 'react-router-dom';
import {RestrictedView, ROLE_SUPERVISOR} from "./RoleRestriction";

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
                <PanelLink to="/patches" label="Patches" margin="mt-2">
                    <FontAwesomeIcon icon="band-aid" transform={{ rotate: -45 }}/>
                </PanelLink>
                <PanelLink to="/modules" label="Modules" margin="mt-2">
                    <FontAwesomeIcon icon="clone" />
                </PanelLink>
                <RestrictedView minRole={ROLE_SUPERVISOR}>
                    <PanelLink to="/users" label="Users" margin="mt-2">
                        <FontAwesomeIcon icon="users"/>
                    </PanelLink>
                </RestrictedView>
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