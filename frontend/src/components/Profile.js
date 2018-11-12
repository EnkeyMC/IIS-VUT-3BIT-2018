import React, { Component } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    Badge
} from 'reactstrap';


export default class Profile extends Component {
    render () {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg="8">
                        <Card>
                            <CardHeader className="h4">User Name</CardHeader>
                            <CardBody>
                                <Container>
                                    <Row className="border-bottom pb-1">
                                        <Container>
                                            <Row className="mb-3">
                                                <Col md="6" xs="12">
                                                    <FontAwesomeIcon icon="user" fixedWidth/> Name
                                                </Col>
                                                <Col md="6" xs="12">Jan Novak</Col>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col md="6" xs="12">
                                                    <FontAwesomeIcon icon="envelope" fixedWidth/> Email
                                                </Col>
                                                <Col md="6" xs="12">jan.novak@email.com</Col>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col md="6" xs="12">
                                                    <FontAwesomeIcon icon="birthday-cake" fixedWidth/> Birthday
                                                </Col>
                                                <Col md="6" xs="12">4.9.1989</Col>
                                            </Row>
                                            <Row>
                                                <Col md="6" xs="12">
                                                    <FontAwesomeIcon icon="laptop-code" fixedWidth/> Programming languages
                                                </Col>
                                                <Col md="6" xs="12">
                                                    <Badge color="warning" pill className="mr-1">Javascript</Badge>
                                                    <Badge color="primary" pill className="mr-1">C++</Badge>
                                                    <Badge color="danger" pill>Java</Badge>
                                                </Col>
                                            </Row>
                                        </Container>
                                        {/*<Col>*/}
                                        {/*<Row className="pb-lg-4">*/}
                                        {/*<div className="icons text-center mr-2">*/}
                                        {/*<FontAwesomeIcon icon ="laptop-code" fixedWidth/>*/}
                                        {/*</div>*/}
                                        {/*Programming languages*/}
                                        {/*</Row>*/}
                                        {/*</Col>*/}
                                        {/*<Col>*/}
                                        {/*<Row className="pb-lg-4">*/}
                                        {/*Jan Novak*/}
                                        {/*</Row>*/}
                                        {/*<Row className="pb-lg-4">*/}
                                        {/*jan.novak@email.com*/}
                                        {/*</Row>*/}
                                        {/*<Row className="pb-lg-4">*/}
                                        {/*4.1.1987*/}
                                        {/*</Row>*/}
                                        {/*<Row className="pb-lg-4">*/}
                                        {/*<Badge color="warning" pill className="mr-1">Javascript</Badge>*/}
                                        {/*<Badge color="primary" pill className="mr-1">C++</Badge>*/}
                                        {/*<Badge color="danger" pill>Java</Badge>*/}
                                        {/*</Row>*/}
                                        {/*</Col>*/}
                                    </Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <FontAwesomeIcon icon="calendar-alt" fixedWidth/> Date Joined
                                        </Col>
                                        <Col>6.9.2015</Col>
                                        <Col>
                                            <FontAwesomeIcon icon="clock" fixedWidth/> Last Login
                                        </Col>
                                        <Col>10.11.2018</Col>
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

