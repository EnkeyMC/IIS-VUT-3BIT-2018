import React from "react";
import {connect} from "react-redux";
import {Redirect, Route, withRouter} from "react-router";
import {withAlert} from "react-alert";

export const ROLE_USER = 0;
export const ROLE_PROGRAMMER = 1;
export const ROLE_SUPERVISOR = 2;
export const ROLE_ADMIN = 3;

const roleNameToLvl = {
    'user': 0,
    'programmer': 1,
    'supervisor': 2,
    'admin': 3,
};

export const RestrictedRoute = connect(
    (state) => {
        return {
            user: state.global.user
        }
    }
)(withRouter(withAlert(({minRole, user, location, alert, ...rest}) => {
    if (!user && minRole === ROLE_USER) {
        return <Redirect to={{pathname: "/login", state: {from: location, error: "You need to login to access this page"}}} />
    } else if (!user || roleNameToLvl[user.position] < minRole) {
        return <Redirect to={{pathname: "/no-permission", state: {from: location}}} />
    }
    return <Route {...rest} />;
})));

export const RestrictedView = connect(
    (state) => {
        return {
            user: state.global.user
        }
    }
)(props => {
    if (!props.user || roleNameToLvl[props.user.position] < props.minRole) {
        return null;
    }
    return props.children;
});
