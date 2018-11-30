import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import Modules from '../components/Modules'
import {Route, Switch} from "react-router";
import ModuleCreate from "../components/ModuleCreate";

export default class ModuleView extends React.Component {
    render () {
        return (
            <DefaultLayout>
                <Switch>
                    <Route path={this.props.match.path+'/create'} component={ModuleCreate} />
                    <Route component={Modules} />
                </Switch>
            </DefaultLayout>
        )
    }
}