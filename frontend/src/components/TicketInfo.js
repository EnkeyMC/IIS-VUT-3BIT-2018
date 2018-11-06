import React, {Component} from 'react';
import {
    Col, Container, Row,
    Media,
    Card, Button, CardTitle, CardText
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {connect} from "react-redux";


export default class TicketInfo extends Component {
    render() {
        return (
            <div className="ticket-info content-height">
                <Container>
                    <Row className="mb-3">
                        <Col className="pt-1 text-right">
                            <Numbering/>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="8" xs="12" md="12">
                            <Container>
                                <Row>
                                    <h1>Name of ticket</h1>
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
                        <Col lg="4" xs="12" md="12">
                            <Container>
                                <Row className="mt-1">
                                    <h4>Related bugs:</h4>
                                    <Bugs/>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

TicketInfo = connect(
    (state, ownProps) => {
        return {
            ticket: state.ticketView.ticketInfo[ownProps.match.params.ticketId],
            loading: state.ticketView.ticketInfo.loading === ownProps.match.params.ticketId,

        }
    }
)(TicketInfo);

function Detail(props) {
    return (
        <Container className="no-margin mt-md-4 border-bottom pb-3">
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
        <Media className="border-bottom pb-3">
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

function Numbering(props) {
    return (
        <div className="font-size">
            <span>1 of ....</span>
            <a href="#" className="pl-3 pr-3"><FontAwesomeIcon icon ="angle-left"/></a>
            <a href="#"><FontAwesomeIcon icon="angle-right"/></a>
        </div>
    );
}

const Bugs = (props) => {
    return (
        <div>
            <Card body outline color="danger" className="mb-2">
                <CardTitle>Insert bugs of ticket</CardTitle>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <Button color="secondary">Probably not needed</Button>
            </Card>
            <Card body outline color="danger" className="mb-2">
                <CardTitle>Insert bugs of ticket</CardTitle>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <Button color="secondary">Probably not needed</Button>
            </Card>
            <Card body outline color="danger" className="mb-2">
                <CardTitle>Insert bugs of ticket</CardTitle>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <Button color="secondary">Probably not needed</Button>
            </Card>
        </div>
    );
};