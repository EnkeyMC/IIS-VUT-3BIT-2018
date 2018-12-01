import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import Modules from '../components/Modules'
import {Route, Switch} from "react-router";
import ModuleCreate from "../components/ModuleCreate";
import ModuleEdit from "../components/ModuleEdit";
import {RestrictedRoute, ROLE_SUPERVISOR} from "../components/RoleRestriction";

export default class ModuleView extends React.Component {
    render () {
        return (
            <DefaultLayout>
                <Switch>
                    <RestrictedRoute minRole={ROLE_SUPERVISOR} path={this.props.match.path+'/create'} component={ModuleCreate} />
                    <RestrictedRoute minRole={ROLE_SUPERVISOR} path={this.props.match.path+'/edit/:id'} component={ModuleEdit} />
                    <Route component={Modules} />
                </Switch>
            </DefaultLayout>
        )
    }
}