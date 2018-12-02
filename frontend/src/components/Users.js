import React from "react";
import {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {getUser} from "../actions/users";
import {withAlert} from "react-alert";
import {withRouter} from "react-router";
import { Col, Container, Row, CardHeader, Button, CardBody, Badge} from "reactstrap";
import CardContainer from "./CardContainer";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Spinner} from "../utils";


export default class Users extends Component {
    componentDidMount() {
        this.props.getUser();
    }
    render() {
        return (
            <div className="info content-height">
                <CardContainer>
                    <CardHeader className="h4">
                        header
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
                                                    jan orlik
                                                </ProfileValue>
                                            </Row>
                                            <Row className="mb-3">
                                                <ProfileKey>
                                                    <FontAwesomeIcon icon="envelope" fixedWidth/> Email
                                                </ProfileKey>
                                                <ProfileValue>
                                                    email
                                                </ProfileValue>
                                            </Row>
                                            <Row className="mb-3">
                                                <ProfileKey>
                                                    <FontAwesomeIcon icon="birthday-cake" fixedWidth/> Birthday
                                                </ProfileKey>
                                                <ProfileValue>
                                                    narozeni
                                                </ProfileValue>
                                            </Row>
                                            <Row className="mb-3">
                                                <ProfileKey>
                                                    <FontAwesomeIcon icon="laptop-code" fixedWidth/> Programming
                                                    languages
                                                </ProfileKey>
                                                <ProfileValue>
                                                    jayzku
                                                </ProfileValue>
                                            </Row>
                                            <Row>
                                                <ProfileKey>
                                                    <FontAwesomeIcon icon="user-tie" fixedWidth/> Role
                                                </ProfileKey>
                                                <ProfileValue>
                                                    pozice
                                                </ProfileValue>
                                            </Row>
                                        </Container>
                                    </Row>
                                    <Row className="mt-3 text-muted">
                                        <Col>
                                            <FontAwesomeIcon icon="calendar-alt" fixedWidth/> Date Joined
                                        </Col>
                                        <Col>date joined</Col>
                                        <Col>
                                            <FontAwesomeIcon icon="clock" fixedWidth/> Last Login
                                        </Col>
                                        <Col>last loged</Col>
                                    </Row>
                                </Container>
                        }
                    </CardBody>
                </CardContainer>
            </div>
        );
    }
}

Users = connect(
    (state) => {
        return {
            user: state.profileView.user,
            loading: state.profileView.loading,
            error: state.profileView.error,
        }
    },
    dispatch => {
        return {
            getUser: username => dispatch(getUser(username))
        }
    }
)(withAlert(withRouter(Users)));

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
