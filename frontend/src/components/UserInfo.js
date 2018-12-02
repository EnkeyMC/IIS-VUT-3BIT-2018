import React from "react";
import {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {getUserById} from "../actions/users";
import {withAlert} from "react-alert";
import {withRouter} from "react-router";
import {StateRenderer} from "../utils";
import UserCard from "./UserCard";
import Observable from "../utils/Observable";


export default class UserInfo extends Component {
    constructor(props) {
        super(props);

        this.userIdObservable = new Observable(this.getUserId(), val => {
            this.props.getUserById(val);
        });
    }

    componentDidMount() {
        this.userIdObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.userIdObservable.update(this.getUserId());
    }

    getUserId() {
        return this.props.match.params.id ? this.props.match.params.id : this.props.defaultId;
    }
    render() {
        return (
            <div className="info content-height">
                <StateRenderer state={this.props} renderCondition={this.props.user !== null}>
                    {props => {return (
                        <UserCard user={props.user} />
                    )}}
                </StateRenderer>
            </div>
        );
    }
}

UserInfo = connect(
    (state) => {
        return {
            user: state.profileView.user,
            loading: state.profileView.loading,
            error: state.profileView.error,
        }
    },
    dispatch => {
        return {
            getUserById: id => dispatch(getUserById(id))
        }
    }
)(withAlert(withRouter(UserInfo)));
