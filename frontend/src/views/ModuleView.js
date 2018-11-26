import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import Modules from '../components/Modules'

export default class ModuleView extends React.Component {
    render () {
        return (
            <DefaultLayout>
                <Modules/>
            </DefaultLayout>
        )
    }
}