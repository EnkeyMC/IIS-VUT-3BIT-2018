import React, {Component} from 'react';
import {
    Col, Container, Row,
    Media,
    Card, CardTitle, CardText
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {connect} from "react-redux";
import {getTicket, setTicketError} from '../actions';
import {Link} from "react-router-dom";
import Error from "./Error";
import {Spinner} from "../utils";
import Observable from "../utils/Observable";
import pathToRegexp from 'path-to-regexp';
import {withRouter} from "react-router";


export default class TicketInfo extends Component {
    constructor(props) {
        super(props);

        this.ticketIdObservable = new Observable(this.props.match.params.ticketId);
        this.ticketIdObservable.setOnChanged(newValue => {
            if (newValue)
                this.props.getTicket(newValue);
        });

        this.defaultTicketIdObservable = new Observable(this.props.defaultId);
        this.defaultTicketIdObservable.setOnChanged(newValue => {
            if (newValue !== null && !this.props.match.params.ticketId && !this.props.tickets.loading)
                this.props.getTicket(newValue);
        });
    }

    componentDidMount() {
        this.ticketIdObservable.triggerOnChanged();
        this.defaultTicketIdObservable.triggerOnChanged();
        this.props.setTicketError("Nothing to show");
    }

    componentDidUpdate() {
        this.ticketIdObservable.update(this.props.match.params.ticketId);
        this.defaultTicketIdObservable.update(this.props.defaultId);
    }

    getTicketId() {
        return this.props.match.params.ticketId ? this.props.match.params.ticketId : this.props.defaultId;
    }

    render() {
        const ticket = this.props.ticket;

        if (this.props.loading) {
            return (
                <div className="ticket-info content-height flex-mid">
                    <Spinner size="5x" />
                </div>
            );
        }

        if (this.props.error) {
            return (
                <div className="ticket-info content-height flex-mid">
                    <Error>
                        {this.props.error}
                    </Error>
                </div>
            );
        }

        if (!this.props.tickets.data)
            return null;

        if (!ticket)
            return null;

        let prevTicketId, nextTicketId, idx, ticketIdx;
        for (idx = 0; idx < this.props.tickets.data.length; idx++) {
            if (String(this.props.tickets.data[idx].id) === String(this.getTicketId())) {
                ticketIdx = idx+1;
                break;
            }
            prevTicketId = this.props.tickets.data[idx].id;
        }
        ++idx;
        nextTicketId = this.props.tickets.data[idx] ? this.props.tickets.data[idx].id : undefined;

        return (
            <div className="ticket-info content-height">
                <Container>
                    <Row className="mb-3">
                        <Col className="pt-1 text-right">
                            <Container>
                                <Row>
                                    <Col>
                                        <Numbering prevId={prevTicketId} nextId={nextTicketId} thisIdx={ticketIdx} size={this.props.tickets.data.length} />
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="8" xs="12" md="12">
                            <Container>
                                <Row>
                                    <Col>
                                        <h1>#{ticket.id} - {ticket.title}</h1>
                                    </Col>
                                </Row>
                                <Row className="pt-3 border-bottom">
                                    <Col>
                                        <Detail ticket={ticket} />
                                    </Col>
                                </Row>
                                <Row className="pt-3 border-bottom">
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
                                    <Col>
                                        <h4>Related bugs:</h4>
                                        <BugsContainer/>
                                    </Col>
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
    (state) => {
        return {
            ticket: state.ticketView.ticketInfo.data,
            tickets: state.ticketView.tickets,
            ticketsLoading: state.ticketView.tickets.loading,
            loading: state.ticketView.ticketInfo.loading,
            error: state.ticketView.ticketInfo.error
        }
    },
    (dispatch) => {
        return {
            getTicket: (ticketId) => dispatch(getTicket(ticketId)),
            setTicketError: (msg) => dispatch(setTicketError(msg))
        }
    }
)(TicketInfo);

const Detail = withRouter((props) => {
    const toPath = pathToRegexp.compile(props.match.path);
    return (
        <Container className="no-margin mt-md-4 pb-3">
            <h4>Details</h4>
            <Row>
                <Col md="6" xs="12">
                    <Row className="no-margin"><span className="text-muted">Author:</span>&nbsp;<Link to={"/profile/view/"+props.ticket.author} >{props.ticket.author}</Link></Row>
                    <Row className="no-margin"><span className="text-muted">Assigned programmer:</span>&nbsp;<Link to={"/profile/view/"+props.ticket.expert} >{props.ticket.expert}</Link></Row>
                </Col>
                <Col md="6" xs="12">
                    <Row className="no-margin"><span className="text-muted">State:</span>&nbsp;{props.ticket.status}&nbsp;{props.ticket.status === 'duplicate' ? <Link to={toPath({ticketId: props.ticket.duplicate})} >#{props.ticket.duplicate}</Link> : null}</Row>
                    <Row className="no-margin"><span className="text-muted">Date:</span>&nbsp;{props.ticket.created}</Row>
                </Col>
            </Row>
        </Container>
    );
});

function Description(props) {
    return (
        <Col className="pb-3 text-justify">
            <h4>Description</h4>
            {props.children}
        </Col>
    );
}

function UploadFiles(props) {
    return (
      <Col>
          <h4>Uploaded files</h4>
      </Col>
    );
}

const Numbering = withRouter((props) => {
    const toPath = pathToRegexp.compile(props.match.path);
    return (
        <div className="font-size">
            <span>{props.thisIdx} of {props.size}</span>
            <Link to={toPath({ticketId: props.prevId})} className={"ml-3 mr-3 " + (props.prevId ? "" : "disabled")}><FontAwesomeIcon icon ="angle-up"/></Link>
            <Link to={toPath({ticketId: props.nextId})} className={props.nextId ? "" : "disabled"}><FontAwesomeIcon icon="angle-down"/></Link>
        </div>
    );
});

function BugsContainer() {
    return (
        <div>
            <Bug/>
            <Bug/>
            <Bug/>
        </div>
    );
}

function Bug(props) {
    return (
        <Card body outline className="mb-2 bugs">
            <CardTitle>Insert bugs of ticket</CardTitle>
            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
        </Card>
    );
}