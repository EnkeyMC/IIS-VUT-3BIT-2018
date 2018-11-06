import React, {Component} from 'react';
import {
    Col, Container, Row,
    Media,
    Card, Button, CardTitle, CardText
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {connect} from "react-redux";
import {getTicket} from '../actions';
import {Link} from "react-router-dom";


export default class TicketInfo extends Component {
    constructor(props) {
        super(props);

        this._lastTicket = this.props.match.params.ticketId;
    }

    componentDidMount() {
        this.props.getTicket(this.props.match.params.ticketId);
    }

    componentDidUpdate() {
        if (this._lastTicket !== this.props.match.params.ticketId) {
            this._lastTicket = this.props.match.params.ticketId;
            this.props.getTicket(this.props.match.params.ticketId);
        }
    }

    render() {
        const ticket = this.props.ticket;
        if (!ticket)
            return null;
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
                                    <h1>{ticket.title}</h1>
                                </Row>
                                <Row className="pt-3">
                                    <Detail ticket={ticket} />
                                </Row>
                                <Row className="pt-3">
                                    <Description>{ticket.description}</Description>
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
            ticket: state.ticketView.ticketInfo.data[ownProps.match.params.ticketId],
            loading: state.ticketView.ticketInfo.loading === ownProps.match.params.ticketId,
            error: state.ticketView.ticketInfo.error === ownProps.match.params.ticketId
        }
    },
    (dispatch) => {
        return {
            getTicket: (ticketId) => dispatch(getTicket(ticketId))
        }
    }
)(TicketInfo);

function Detail(props) {
    return (
        <Container className="no-margin mt-md-4 border-bottom pb-3">
            <Media heading>Details</Media>
            <Row>
                <Col md="6" xs="12">
                    <Row className="no-margin"><span className="text-muted">Author:</span>&nbsp;{props.ticket.author}</Row>
                    <Row className="no-margin"><span className="text-muted">Vulnerability:</span>&nbsp;</Row>
                </Col>
                <Col md="6" xs="12">
                    <Row className="no-margin"><span className="text-muted">State:</span>&nbsp;{props.ticket.status}&nbsp;{props.ticket.status === 'duplicate' ? <Link to={"/ticket/"+props.ticket.duplicate} >#{props.ticket.duplicate}</Link> : null}</Row>
                    <Row className="no-margin"><span className="text-muted">Date:</span>&nbsp;{props.ticket.created}</Row>
                </Col>
            </Row>
        </Container>
    );
}

function Description(props) {
    return (
        <Media className="border-bottom pb-3">
            <Media body className="text-justify">
                <Media heading>Description</Media>
                {props.children}
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