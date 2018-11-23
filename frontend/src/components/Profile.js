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
import {getUser} from "../actions";
import {Spinner} from "../utils";
import {withAlert} from "react-alert";
import {Redirect, withRouter} from "react-router";
import Error from "./Error";
import Observable from "../utils/Observable";
import CardContainer from "./CardContainer";
import {Link} from "react-router-dom";


function ProfileKey(props) {
    return (
        <Col md="6" xs="12" className="text-muted">
            {props.children}
        </Col>
    );
}

function ProfileValue(props) {
    return <Col md="6" xs="12">{props.children}</Col>
}


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
            <CardContainer>
                <CardHeader className="h4">
                    {!this.props.loading ? this.props.user.username : "Loading..."}
                    {
                        this.props.username === this.props.loggedInUserUsername ?
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
                    }
                </CardHeader>
                <CardBody>
                    {
                        this.props.loading ?
                            <Container>
                                <Row>
                                    <Col className="text-center mt-4">
                                        <Spinner size="5x" />
                                    </Col>
                                </Row>
                            </Container>
                            :
                            <Container>
                                <Row className="border-bottom pb-4">
                                    <Container>
                                        <Row className="mb-3">
                                            <ProfileKey>
                                                <FontAwesomeIcon icon="user" fixedWidth/> Name
                                            </ProfileKey>
                                            <ProfileValue>
                                                {this.props.user.first_name} {this.props.user.last_name}
                                            </ProfileValue>
                                        </Row>
                                        <Row className="mb-3">
                                            <ProfileKey>
                                                <FontAwesomeIcon icon="envelope" fixedWidth/> Email
                                            </ProfileKey>
                                            <ProfileValue>
                                                {this.props.user.email}
                                            </ProfileValue>
                                        </Row>
                                        <Row className="mb-3">
                                            <ProfileKey>
                                                <FontAwesomeIcon icon="birthday-cake" fixedWidth/> Birthday
                                            </ProfileKey>
                                            <ProfileValue>
                                                {this.props.user.profile.birth_date}
                                            </ProfileValue>
                                        </Row>
                                        <Row>
                                            <ProfileKey>
                                                <FontAwesomeIcon icon="laptop-code" fixedWidth/> Programming
                                                languages
                                            </ProfileKey>
                                            <ProfileValue>
                                                {this.props.user.profile.languages.map(item => <Badge
                                                    color="primary" pill className="mr-1"
                                                    key={item}>{item}</Badge>)}
                                            </ProfileValue>
                                        </Row>
                                    </Container>
                                </Row>
                                <Row className="mt-3 text-muted">
                                    <Col>
                                        <FontAwesomeIcon icon="calendar-alt" fixedWidth/> Date Joined
                                    </Col>
                                    <Col>{this.props.user.date_joined}</Col>
                                    <Col>
                                        <FontAwesomeIcon icon="clock" fixedWidth/> Last Login
                                    </Col>
                                    <Col>{this.props.user.last_login ? this.props.user.last_login : "Never"}</Col>
                                </Row>
                            </Container>
                    }
                </CardBody>
            </CardContainer>
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
