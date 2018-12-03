import React, {Component} from 'react';
import {
    Col, Container, Row,
    Media,
    Card, CardTitle, CardText, Badge, Modal, ModalHeader, ModalBody, Button
} from "reactstrap";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {
    submitForm
} from "../actions";
import Observable from "../utils/Observable";
import {Spinner, StateRenderer} from "../utils";
import Error from "./Error";
import {Numbering} from "./Numbering";
import {Form} from "./form/Form";
import MultiSearchSelect, {MultiSelectItem} from "./form/MultiSearchSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {RestrictedView, ROLE_PROGRAMMER} from "./RoleRestriction";
import CloseBtn from "./CloseBtn";
import pathToRegexp from "path-to-regexp";
import {cancelActionRequests} from "../actions/global";
import {getTickets} from "../actions/tickets";
import {clearBugTickets, GET_BUG, GET_BUG_TICKET, getBug, getBugTicket, setBug, setBugError} from "../actions/bugs";
import {withAlert} from "react-alert";

export default class BugInfo extends Component {
    constructor(props) {
        super(props);

        this.bugIdObservable = new Observable(
            this.getBugId(),
            newValue => {
                if (newValue) {
                    this.props.getBug(newValue);
                } else {
                    this.props.cancelActions(GET_BUG);
                    this.props.setBugError("Nothing to show");
                }
            }
        );

        this.bugObservable = new Observable(this.props.bug);
        this.bugObservable.setOnChanged(newValue => {
            if (newValue) {
                this.requestTickets();
            }
        });

        this.state = {
            assignTicketsModalOpen: false
        };

        this.toggleAssignTicketsModal = this.toggleAssignTicketsModal.bind(this);
        this.closeAssignTicketsModal = this.closeAssignTicketsModal.bind(this);
        this.removeTicket = this.removeTicket.bind(this);
    }

    componentDidMount() {
        this.bugIdObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.bugIdObservable.update(this.getBugId());
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

    toggleAssignTicketsModal() {
        this.setState({
            assignTicketsModalOpen: !this.state.assignTicketsModalOpen
        });
    }

    closeAssignTicketsModal() {
        this.setState({
            assignTicketsModalOpen: false
        });
    }

    removeTicket(ticketId) {console.log("fds");
        let data = new FormData();
        this.props.bug.tickets.forEach(id => id !== ticketId ? data.append('tickets', id) : false);
        if (!data.has('tickets'))
            data.append('tickets', '');
        this.props.submitForm('remove-ticket', '/api/bugs/'+this.props.bug.id+'/', data, true)
            .then(action => {
                if (action.payload) {
                    this.props.getBug(this.getBugId());
                } else if (action.error) {
                    if (action.error.response && action.error.response.data.tickets)
                        this.props.alert.error("You cannot remove this ticket.");
                    else if (action.error.response && action.error.response.data.detail)
                        this.props.alert.error(action.error.response.data.detail);
                    else
                        this.props.alert.error(action.error.message);

                }
            });
    }

    render() {
        const bug = this.props.bug;

        if (this.props.loading) {
            return (
                <div className="info content-height flex-mid">
                    <Spinner size="5x" />
                </div>
            );
        }

        if (this.props.error) {
            return (
                <div className="info content-height flex-mid">
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

        const toPath = pathToRegexp.compile(this.props.match.path);
        const path = toPath({
            id: this.getBugId()
        });
        const search = this.props.location.search;

        return (
            <div className="info content-height">
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
                                <Row className="pt-3">
                                    <Col>
                                        <RestrictedView minRole={ROLE_PROGRAMMER}>
                                            <Link to={path+'/edit'+search} className="mr-3"><FontAwesomeIcon icon="edit"/>&nbsp;Edit</Link>
                                        </RestrictedView>
                                    </Col>
                                </Row>
                                <Row className="pt-3 border-bottom">
                                    <Col className="mt-md-4 pb-3">
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
                                        <TicketsContainer toggleModal={this.toggleAssignTicketsModal} removeTicket={this.removeTicket} />
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <Modal isOpen={this.state.assignTicketsModalOpen} toggle={this.toggleAssignTicketsModal} centered>
                    <ModalHeader toggle={this.toggleAssignTicketsModal}>Assign tickets</ModalHeader>
                    <ModalBody>
                        <AssignTicketsForm bug={this.props.bug} closeModal={this.closeAssignTicketsModal} />
                    </ModalBody>
                </Modal>
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
            cancelActions: (actionType) => dispatch(cancelActionRequests(actionType)),
            submitForm: (id, url, data, edit) => dispatch(submitForm(id, url, data, edit)),
        }
    }
)(withAlert(BugInfo));

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
            {props.data.map(ticket => <Ticket ticket={ticket} key={ticket.id} removeTicket={props.removeTicket} />)}
            {
                props.loading ?
                    <div className="flex-mid mt-4">
                        <Spinner size="2x" />
                    </div>
                    :
                    null
            }
            <RestrictedView minRole={ROLE_PROGRAMMER}>
                <AssignTicketBtn onClick={props.toggleModal} />
            </RestrictedView>
        </div>
    );
});

function Ticket(props) {
    return (
        <Card body outline tag={Link} to={'/tickets/all/'+props.ticket.id} className={"mb-2 bugs state-"+props.ticket.status}>
            <RestrictedView minRole={ROLE_PROGRAMMER}>
                {props.noRemove ? null : <CloseBtn onClick={(e) => {props.removeTicket(props.ticket.id); e.preventDefault()}}/>}
            </RestrictedView>
            <CardTitle>#{props.ticket.id} - {props.ticket.title}</CardTitle>
            <CardText>
                <small className="text-muted float-left">{props.ticket.author}</small>
                <small className="text-muted float-right">{props.ticket.created}</small>
            </CardText>
        </Card>
    );
}

function AssignTicketBtn(props) {
    return (
        <Card body outline onClick={props.onClick} className="mb-2 bugs card-new-btn">
            <CardText className="text-center">
                <FontAwesomeIcon icon="plus" size="2x" color="rgba(0, 0, 0, 0.1)" className="mt-3 mb-3" />
            </CardText>
        </Card>
    );
}

function Detail(props) {
    const bug = props.bug;
    return (
        <>
            <Media heading>Details</Media>
            <Row>
                <Col md="6" xs="12">
                    <Row className="no-margin">
                        <span className="text-muted">
                            Author:
                        </span>
                        &nbsp;
                        <Link to={'/profile/view/'+bug.author} >{bug.author}</Link>
                    </Row>
                    <Row className="no-margin">
                        <span className="text-muted">
                            Severity:
                        </span>
                        {
                            bug.severity ?
                                <>&nbsp;<Badge color="light" style={{backgroundColor: bug.severity.color}}>{bug.severity.name}</Badge></>
                                :
                                null
                        }
                        &nbsp;
                        {bug.vulnerability ? <Badge color="danger">Vulnerability</Badge> : null}
                    </Row>
                </Col>
                <Col md="6" xs="12">
                    <Row className="no-margin">
                        <span className="text-muted">
                            Module:
                        </span>
                        &nbsp;
                        {bug.module ? bug.module.name : null}
                    </Row>
                    <Row className="no-margin">
                        <span className="text-muted">
                            Created:
                        </span>
                        &nbsp;
                        {bug.created}
                    </Row>
                </Col>
            </Row>
        </>
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

class AssignTicketsForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSuccess = this.handleFormSuccess.bind(this);
    }

    handleFormSuccess(id, data) {
        this.props.setBug(data);
        this.props.closeModal();
    }

    componentDidMount() {
        this.props.getTickets();
    }

    render() {
        return (
            <Form edit id="assign-tickets-form" url={"/api/bugs/"+this.props.bug.id+'/'} onSubmitSuccess={this.handleFormSuccess}>
                <StateRenderer state={this.props} renderCondition={this.props.data !== null && this.props.bug}>
                    {props => { return (<>
                        <MultiSearchSelect name="tickets" defaultValue={props.bug.tickets}>
                            {
                                () => props.data.map(
                                    ticket => <MultiSelectItem
                                        key={ticket.id}
                                        value={ticket.id}
                                        label={"#"+ticket.id+" - "+ticket.title}
                                    >
                                        {label => {return (
                                            <span className={"pl-2 state-"+ticket.status}>{label}</span>
                                        )}}
                                    </MultiSelectItem>
                                )
                            }
                        </MultiSearchSelect>
                        <Button type="submit" color="primary" className="w-100 mt-4">Assign</Button>
                    </>)}}
                </StateRenderer>
            </Form>
        );
    }
}

AssignTicketsForm = connect(
    (state) => {
        return {
            loading: state.ticketView.tickets.loading,
            error: state.ticketView.tickets.error,
            data: state.ticketView.tickets.data
        }
    },
    dispatch => {
        return {
            getTickets: () => dispatch(getTickets()),
            setBug: (data) => dispatch(setBug(data))
        }
    }
) (AssignTicketsForm);
