import React, {Component} from 'react';
import {
    Col, Container, Row,
    Media,
    Card, CardTitle, CardText
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";

export default class BugInfo extends Component {
    render() {
        return (
            <div className="ticket-info content-height">
                <Container>
                    <Row className="mb-3">
                        <Col className="pt-1 text-right">
                            <Numbering />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="8" xs="12" md="12">
                            <Container>
                                <Row>
                                    <h1>#id - bug title</h1>
                                </Row>
                                <Row className="pt-3 border-bottom">
                                    <Detail/>
                                </Row>
                                <Row className="pt-3 border-bottom">
                                    <Description/>
                                </Row>
                                <Row className="pt-3">
                                    <UploadFiles/>
                                </Row>
                            </Container>
                        </Col>
                        <Col lg="4" xs="12" md="12">
                            <Container>
                                <Row className="mt-1">
                                    <h4>Bug occurrence:</h4>
                                    <TicketsContainer/>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

const Numbering = withRouter((props) => {
    return (
        <div className="font-size">
            <span>1 of ...</span>
            <FontAwesomeIcon icon ="angle-up"/>
            <FontAwesomeIcon icon="angle-down"/>
        </div>
    );
});

function TicketsContainer() {
    return (
        <div>
            <Ticket/>
            <Ticket/>
            <Ticket/>
        </div>
    );
}

function Ticket(props) {
    return (
        <Card body outline className="mb-2 bugs">
            <CardTitle>Ticket name where is this bug</CardTitle>
            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
        </Card>
    );
}

function Detail(props) {
    return (
        <Container className="no-margin mt-md-4 pb-3">
            <Media heading>Details</Media>
            <Row>
                <Col md="6" xs="12">
                    <Row className="no-margin"><span className="text-muted">Author:</span></Row>
                    <Row className="no-margin"><span className="text-muted">Vulnerability:</span></Row>
                </Col>
                <Col md="6" xs="12">
                    <Row className="no-margin"><span className="text-muted">Reward:</span></Row>
                    <Row className="no-margin"><span className="text-muted">Date:</span></Row>
                </Col>
            </Row>
        </Container>
    );
}

function Description(props) {
    return (
        <Media className="pb-3">
            <Media body className="text-justify">
                <Media heading>Description</Media>
                Add here some description of this bug
            </Media>
        </Media>
    );
}

function UploadFiles(props) {
    return (
        <div className="w-100">
            <Media heading>Uploaded files</Media>
        </div>
    );
}