import React, {Component} from 'react';
import {
    Col, Container, Row,
    Media,
    Card, CardTitle, CardText, Badge
} from "reactstrap";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {cancelActionRequests, clearBugTickets, GET_BUG_TICKET, getBug, getBugTicket, setBugError} from "../actions";
import Observable from "../utils/Observable";
import {Spinner} from "../utils";
import Error from "./Error";
import {Numbering} from "./Numbering";

export default class BugInfo extends Component {
    constructor(props) {
        super(props);

        this.bugIdObservable = new Observable(this.props.match.params.id);
        this.bugIdObservable.setOnChanged(newValue => {
            if (newValue) {
                this.props.getBug(newValue);
            }
        });

        this.defaultBugIdObservable = new Observable(this.props.defaultId);
        this.defaultBugIdObservable.setOnChanged(newValue => {
            if (newValue !== null && !this.props.match.params.id && !this.props.bugs.loading) {
                this.props.getBug(newValue);
            }
        });

        this.bugObservable = new Observable(this.props.bug);
        this.bugObservable.setOnChanged(newValue => {
            if (newValue) {
                this.requestTickets();
            }
        });
    }

    componentDidMount() {
        this.bugIdObservable.triggerOnChanged();
        this.defaultBugIdObservable.triggerOnChanged();
        this.props.setBugError("Nothing to show");
    }

    componentDidUpdate() {
        this.bugIdObservable.update(this.props.match.params.id);
        this.defaultBugIdObservable.update(this.props.defaultId);
        this.bugObservable.update(this.props.bug);
    }

    componentWillUnmount() {
        this.props.cancelActions(GET_BUG_TICKET);
        this.props.clearBugTickets();
    }

    getBugId() {
        return this.props.match.params.id ? this.props.match.params.id : this.props.defaultId;
    }

    requestTickets() {
        this.props.cancelActions(GET_BUG_TICKET);
        this.props.clearBugTickets();
        this.props.bug.tickets.forEach(id => this.props.getBugTicket(id));
    }

    render() {
        const bug = this.props.bug;

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

        if (!this.props.bugs.data)
            return null;

        if (!bug)
            return null;

        let prevBugId, nextBugId, idx, bugIdx;
        for (idx = 0; idx < this.props.bugs.data.length; idx++) {
            if (String(this.props.bugs.data[idx].id) === String(this.getBugId())) {
                bugIdx = idx+1;
                break;
            }
            prevBugId = this.props.bugs.data[idx].id;
        }
        ++idx;
        nextBugId = this.props.bugs.data[idx] ? this.props.bugs.data[idx].id : undefined;

        return (
            <div className="ticket-info content-height">
                <Container>
                    <Row className="mb-3">
                        <Col className="pt-1 text-right">
                            <Container>
                                <Row>
                                    <Col>
                                        <Numbering
                                            prevId={prevBugId}
                                            nextId={nextBugId}
                                            thisIdx={bugIdx}
                                            size={this.props.bugs.data.length}
                                        />
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
                                        <h1>#{bug.id} - {bug.title}</h1>
                                    </Col>
                                </Row>
                                <Row className="pt-3 border-bottom">
                                    <Col>
                                        <Detail bug={bug} />
                                    </Col>
                                </Row>
                                <Row className="pt-3">
                                    <Description>{bug.description}</Description>
                                </Row>
                            </Container>
                        </Col>
                        <Col lg="4" xs="12" md="12">
                            <Container>
                                <Row className="mt-1">
                                    <Col>
                                        <h4>Bug occurrence:</h4>
                                        <TicketsContainer/>
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

BugInfo = connect(
    (state) => {
        return {
            bug: state.bugView.bugInfo.data,
            loading: state.bugView.bugInfo.loading,
            error: state.bugView.bugInfo.error,
            bugs: state.bugView.bugs
        }
    },
    (dispatch) => {
        return {
            getBug: (bugId) => dispatch(getBug(bugId)),
            setBugError: (msg) => dispatch(setBugError(msg)),
            getBugTicket: (id) => dispatch(getBugTicket(id)),
            clearBugTickets: () => dispatch(clearBugTickets()),
            cancelActions: (actionType) => dispatch(cancelActionRequests(actionType))
        }
    }
)(BugInfo);

const TicketsContainer = connect(
    (state) => {
        return {
            loading: state.bugView.bugInfo.bugTickets.loading !== 0,
            error: state.bugView.bugInfo.bugTickets.error,
            data: state.bugView.bugInfo.bugTickets.data
        }
    }
)((props) => {
    if (props.error) {
        return props.error.map((err, idx) => {
            return (
                <div className="flex-mid mt-3 mb-3" key={idx}>
                    <Error>
                        {err}
                    </Error>
                </div>
            );
        });
    }

    return (
        <div>
            {props.data.map(ticket => <Ticket ticket={ticket} key={ticket.id} />)}
            {
                props.loading ?
                    <div className="flex-mid mt-4">
                        <Spinner size="2x" />
                    </div>
                    :
                    null
            }
        </div>
    );
});

function Ticket(props) {
    return (
        <Card body outline tag={Link} to={'/tickets/all/'+props.ticket.id} className={"mb-2 bugs state-"+props.ticket.status}>
            <CardTitle>#{props.ticket.id} - {props.ticket.title}</CardTitle>
            <CardText>
                <small className="text-muted float-left">{props.ticket.author}</small>
                <small className="text-muted float-right">{props.ticket.created}</small>
            </CardText>
        </Card>
    );
}

function Detail(props) {
    return (
        <Container className="no-margin mt-md-4 pb-3">
            <Media heading>Details</Media>
            <Row>
                <Col md="6" xs="12">
                    <Row className="no-margin">
                        <span className="text-muted">
                            Author:
                        </span>
                        &nbsp;
                        <Link to={'/profile/view/'+props.bug.author} >{props.bug.author}</Link>
                    </Row>
                    <Row className="no-margin">
                        <span className="text-muted">
                            Severity:
                        </span>
                        &nbsp;
                        <Badge color="light" style={{backgroundColor: props.bug.severity.color}}>{props.bug.severity.name}</Badge>
                        &nbsp;
                        {props.bug.vulnerability ? <Badge color="danger">Vulnerability</Badge> : null}
                    </Row>
                </Col>
                <Col md="6" xs="12">
                    <Row className="no-margin">
                        <span className="text-muted">
                            Reward: TODO?
                        </span>
                    </Row>
                    <Row className="no-margin">
                        <span className="text-muted">
                            Created:
                        </span>
                        &nbsp;
                        {props.bug.created}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

function Description(props) {
    return (
        <Col className="pb-3 text-justify">
            <h4>Description</h4>
            {props.children}
        </Col>
    );
}