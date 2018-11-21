import React from "react";
import {connect} from "react-redux";
import {Redirect, Route, withRouter} from "react-router";

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
)(withRouter(({component: Component, minRole, user, location, ...rest}) => {
    if (!user || roleNameToLvl[user.user_type] < minRole) {
        return <Redirect to={{pathname: "/no-permission", state: {from: location}}} />
    }
    return <Route {...rest} component={(props) => <Component {...rest} {...props} />} />;
}));

export const RestrictedView = connect(
    (state) => {
        return {
            user: state.global.user
        }
    }
)(props => {
    if (!props.user || roleNameToLvl[props.user.user_type] < props.minRole) {
        return null;
    }
    return props.children;
});
