import React, { Component } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    Badge,
    Button
} from 'reactstrap';
import {connect} from "react-redux";
import {getUser} from "../actions/users";
import {Spinner, StateRenderer} from "../utils";
import {withAlert} from "react-alert";
import {Redirect, withRouter} from "react-router";
import Error from "./Error";
import Observable from "../utils/Observable";
import CardContainer from "./CardContainer";
import {Link} from "react-router-dom";
import UserCard from "./UserCard";


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.usernameObservable = new Observable(this.props.username);
        this.usernameObservable.setOnChanged(newValue => {
            this.props.getUser(newValue);
        });
    }


    componentDidMount() {
        this.usernameObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.usernameObservable.update(this.props.username);
    }

    render () {
        if (this.props.username === null) {
            this.props.alert.error("Login to view your profile");
            return <Redirect to={{pathname: "/login", state: {from: this.props.location}}} />;
        }

        if (this.props.error) {
            return (
                <CardContainer>
                    <Error className="mt-5 mb-5">
                        {this.props.error}
                    </Error>
                </CardContainer>
            );
        }

        if (!this.props.user)
            return null;


        return (
            <StateRenderer state={this.props} renderCondition={this.props.user !== null}>
                {props => {return (
                    <UserCard user={props.user} buttons={
                        props.username === this.props.loggedInUserUsername ?
                            <Button
                                tag={Link}
                                to={{pathname: '/profile/edit', state: {from: this.props.location}}}
                                color="primary"
                                className="float-right"
                            >
                                Edit <FontAwesomeIcon icon="edit"/>
                            </Button>
                            :
                            null
                    } />
                )}}
            </StateRenderer>
        )
    }
}

Profile = connect(
    (state, ownProps) => {
        return {
            user: state.profileView.user,
            username: ownProps.match.params.username ? ownProps.match.params.username : (state.global.user ? state.global.user.username : null),
            loading: state.profileView.loading,
            error: state.profileView.error,
            loggedInUserUsername: state.global.user ? state.global.user.username : null
        }
    },
    dispatch => {
        return {
            getUser: username => dispatch(getUser(username))
        }
    }
)(withAlert(withRouter(Profile)));
