import React from "react";
import BugList from "../components/BugList";
import BugInfo from "../components/BugInfo";
import DefaultLayout from "./layouts/DefaultLayout";
import {Route, Switch, withRouter} from "react-router";
import {connect} from "react-redux";
import {getBugs} from "../actions";
import Observable from "../utils/Observable";

export default class BugView extends React.Component {
    constructor(props) {
        super(props);

        this.pathObservable = new Observable(this.props.match.path);
        this.pathObservable.setOnChanged(() => {
            this.props.getBugs();
        });
        this.pathObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.pathObservable.update(this.props.match.path);
    }

    render () {
        let defaultId = null;
        const data = this.props.bugs.data;
        if (data && data.length > 0)
            defaultId = data[0].id;

        return (
            <DefaultLayout>
                <BugList bugs={this.props.bugs} />
                <Switch>
                    <Route path={this.props.match.path+'/:id(\\d+)?'} render={(props) => <BugInfo defaultId={defaultId} {...props} />} />
                </Switch>
            </DefaultLayout>
        )
    }
}

BugView = connect(
    state => {
        return {
            bugs: state.bugView.bugs
        }
    },
    dispatch => {
        return {
            getBugs: () => dispatch(getBugs())
        }
    }
)(withRouter(BugView));