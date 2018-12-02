import React from 'react';
import CardContainer from "./CardContainer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Badge, CardBody, CardHeader, Col, Container, Row} from "reactstrap";


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

export default function UserCard(props) {
    return (
        <CardContainer>
            <CardHeader className="h4">
                {props.user.username}
                {
                    props.user.is_active === false ?
                        <h5 className="text-muted d-inline"> inactive</h5>
                        :
                        null
                }
                {props.buttons}
            </CardHeader>
            <CardBody>
                <Container>
                    <Row className="border-bottom pb-4">
                        <Container>
                            <Row className="mb-3">
                                <ProfileKey>
                                    <FontAwesomeIcon icon="user" fixedWidth/> Name
                                </ProfileKey>
                                <ProfileValue>
                                    {props.user.first_name} {props.user.last_name}
                                </ProfileValue>
                            </Row>
                            <Row className="mb-3">
                                <ProfileKey>
                                    <FontAwesomeIcon icon="envelope" fixedWidth/> Email
                                </ProfileKey>
                                <ProfileValue>
                                    {props.user.email}
                                </ProfileValue>
                            </Row>
                            <Row className="mb-3">
                                <ProfileKey>
                                    <FontAwesomeIcon icon="birthday-cake" fixedWidth/> Birthday
                                </ProfileKey>
                                <ProfileValue>
                                    {props.user.birth_date}
                                </ProfileValue>
                            </Row>
                            <Row className="mb-3">
                                <ProfileKey>
                                    <FontAwesomeIcon icon="laptop-code" fixedWidth/> Programming
                                    languages
                                </ProfileKey>
                                <ProfileValue>
                                    {props.user.languages.map(item => <Badge
                                        color="primary" pill className="mr-1"
                                        key={item}>{item}</Badge>)}
                                </ProfileValue>
                            </Row>
                            <Row>
                                <ProfileKey>
                                    <FontAwesomeIcon icon="user-tie" fixedWidth/> Role
                                </ProfileKey>
                                <ProfileValue>
                                    {props.user.position}
                                </ProfileValue>
                            </Row>
                        </Container>
                    </Row>
                    <Row className="mt-3 text-muted">
                        <Col>
                            <FontAwesomeIcon icon="calendar-alt" fixedWidth/> Date Joined
                        </Col>
                        <Col>{props.user.date_joined}</Col>
                        <Col>
                            <FontAwesomeIcon icon="clock" fixedWidth/> Last Login
                        </Col>
                        <Col>{props.user.last_login ? props.user.last_login : "Never"}</Col>
                    </Row>
                </Container>
            </CardBody>
        </CardContainer>
    )
}