import React, { Component } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    Card,
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


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this._lastUsername = this.props.username;
    }


    componentDidMount() {
        this.props.getUser(this._lastUsername);
    }

    componentDidUpdate() {
        if (this.props.username !== this._lastUsername) {
            this._lastUsername = this.props._lastUsername;
            this.props.getUser(this._lastUsername);
        }
    }

    render () {
        if (this.props.username === null)
            return null; // TODO 404 page, or login page

        if (!this.props.user)
            return null; // TODO show loading

        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg="8">
                        <Card>
                            <CardHeader className="h4">
                                {this.props.user.username}
                                <Button color="primary" className="float-right">Edit <FontAwesomeIcon icon="edit"/></Button>
                            </CardHeader>
                            <CardBody>
                                <Container>
                                    <Row className="border-bottom pb-1">
                                        <Container>
                                            <Row className="mb-3">
                                                <Col md="6" xs="12">
                                                    <FontAwesomeIcon icon="user" fixedWidth/> Name
                                                </Col>
                                                <Col md="6" xs="12">{this.props.user.first_name} {this.props.user.last_name}</Col>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col md="6" xs="12">
                                                    <FontAwesomeIcon icon="envelope" fixedWidth/> Email
                                                </Col>
                                                <Col md="6" xs="12">{this.props.user.email}</Col>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col md="6" xs="12">
                                                    <FontAwesomeIcon icon="birthday-cake" fixedWidth/> Birthday
                                                </Col>
                                                <Col md="6" xs="12">{this.props.user.profile.birth_date}</Col>
                                            </Row>
                                            <Row>
                                                <Col md="6" xs="12">
                                                    <FontAwesomeIcon icon="laptop-code" fixedWidth/> Programming languages
                                                </Col>
                                                <Col md="6" xs="12">
                                                    {this.props.user.profile.languages.map(item => <Badge color="primary" pill className="mr-1" key={item}>{item}</Badge>)}
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Row>
                                    <Row className="mt-2">
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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

Profile = connect(
    (state, ownProps) => {
        return {
            user: state.profileView.user,
            username: ownProps.match.params.username ? ownProps.match.params.username : (state.global.user ? state.global.user.username : null),
            loading: state.profileView.loading
        }
    },
    dispatch => {
        return {
            getUser: userId => dispatch(getUser(userId))
        }
    }
)(Profile);
