import React from "react";
import Profile from "../components/Profile";
import {Route, Switch} from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import ProfileEdit from "../components/ProfileEdit";
import {RestrictedRoute, ROLE_USER} from "../components/RoleRestriction";

export default class ProfileView extends React.Component {
    render () {
        return (
            <DefaultLayout>
                <Switch>
                    <RestrictedRoute minRole={ROLE_USER} path="/profile/edit" component={ProfileEdit} />
                    <Route path="/profile/view/:username" component={Profile} />
                    <Route path="/profile" component={Profile} />
                </Switch>
            </DefaultLayout>
        )
    }
}