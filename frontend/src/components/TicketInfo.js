import React, {Component} from 'react';
import {Col, Container, Row, Media} from "reactstrap";


export default class TicketList extends Component {
    render() {
        return (
            <div className="ticket-info content-height">
                <Container>
                    <Row>
                        <Col md="8" xs="12">
                            <Container>
                                <Row className="pt-3">
                                    <h1 className="display-4">Name of ticket</h1>
                                </Row>
                                <Row className="pt-3">
                                    <Detail/>
                                </Row>
                                <Row className="pt-3">
                                    <Description/>
                                </Row>
                                <Row className="pt-3">
                                    <UploadFiles/>
                                </Row>
                            </Container>
                        </Col>
                        <Col md="4" xs="12">
                            <Container>
                                <Row>adf</Row>
                                <Row>fdf</Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

function Detail(props) {
    return (
        <Container className="no-margin mt-md-4">
            <Media heading>Details</Media>
            <Row>
                <Col md="6" xs="12">
                    <Row className="no-margin">Relevance:</Row>
                    <Row className="no-margin">Vulnerability:</Row>
                </Col>
                <Col md="6" xs="12">
                    <Row className="no-margin">State:</Row>
                    <Row className="no-margin">Date:</Row>
                </Col>
            </Row>
        </Container>
    );
}

function Description(props) {
    return (
        <Media>
            <Media body>
                <Media heading>Description</Media>
                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras
                purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi
                vulputate fringilla. Donec lacinia congue felis in faucibus.
                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras
                purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi
                vulputate fringilla. Donec lacinia congue felis in faucibus.
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