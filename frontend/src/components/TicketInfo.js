import React, {Component} from 'react';
import {Col, Container, Row} from "reactstrap";


export default class TicketList extends Component {
    render() {
        return (
            <div className="ticket-info content-height">
                <Container>
                    <Row>
                        <Col md="8" xs="12">
                            <Container>
                                <Row>adf</Row>
                                <Row>ad</Row>
                                <Row>df</Row>
                                <Row>sf</Row>
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