import React, {Component} from 'react';
import {
    Col, Container, Row,
    Card, CardTitle, CardText, Badge, Modal, ModalHeader, ModalBody, Button
} from "reactstrap";
import {connect} from "react-redux";
import {
    cancelActionRequests,
    clearTicketBugs, GET_TICKET,
    GET_TICKET_BUG, getBugs,
    getTicket,
    getTicketBug, getTickets, getUsers, setTicket,
    setTicketError, submitForm
} from '../actions';
import {Link} from "react-router-dom";
import Error from "./Error";
import {Spinner, StateRenderer} from "../utils";
import Observable from "../utils/Observable";
import pathToRegexp from 'path-to-regexp';
import {withRouter} from "react-router";
import {Numbering} from "./Numbering";
import CloseBtn from "./CloseBtn";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Form} from "./form/Form";
import MultiSearchSelect, {MultiSelectItem} from "./form/MultiSearchSelect";
import {RestrictedView, ROLE_PROGRAMMER} from "./RoleRestriction";
import {SelectItem} from "./form/SearchSelect";
import SearchSelect from "./form/SearchSelect";


export default class TicketInfo extends Component {
    constructor(props) {
        super(props);

        this.ticketIdObservable = new Observable(this.props.match.params.id);
        this.ticketIdObservable.setOnChanged(newValue => {
            if (newValue)
                this.props.getTicket(newValue);
        });

        this.defaultTicketIdObservable = new Observable(this.props.defaultId);
        this.defaultTicketIdObservable.setOnChanged(newValue => {
            if (newValue !== null && !this.props.match.params.id && !this.props.tickets.loading)
                this.props.getTicket(newValue);
            else if (newValue === null) {
                this.props.cancelActions(GET_TICKET);
                this.props.setTicketError("Nothing to show");
            }
        });

        this.ticketObservable = new Observable(this.props.ticket);
        this.ticketObservable.setOnChanged(newValue => {
            if (newValue)
                this.requestBugs();
        });

        this.state = {
            assignBugsModalOpen: false,
            assignProgrammerModalOpen: false
        };

        this.closeAssignProgrammerModal = this.closeAssignProgrammerModal.bind(this);
        this.toggleAssginProgrammerModal = this.toggleAssginProgrammerModal.bind(this);
        this.toggleAssignBugsModal = this.toggleAssignBugsModal.bind(this);
        this.closeAssignBugsModal = this.closeAssignBugsModal.bind(this);
        this.removeBug = this.removeBug.bind(this);
    }

    componentDidMount() {
        this.ticketIdObservable.triggerOnChanged();
        this.defaultTicketIdObservable.triggerOnChanged();
        this.props.setTicketError("Nothing to show");
    }

    componentDidUpdate() {
        this.ticketIdObservable.update(this.props.match.params.id);
        this.defaultTicketIdObservable.update(this.props.defaultId);
        this.ticketObservable.update(this.props.ticket);
    }

    componentWillUnmount() {
        this.props.cancelActions(GET_TICKET_BUG);
        this.props.clearTicketBugs();
    }

    getTicketId() {
        return this.props.match.params.id ? this.props.match.params.id : this.props.defaultId;
    }

    requestBugs() {
        this.props.cancelActions(GET_TICKET_BUG);
        this.props.clearTicketBugs();
        this.props.ticket.bugs.forEach(id => this.props.getTicketBug(id));
    }

    toggleAssignBugsModal() {
        this.setState({
            assignBugsModalOpen: !this.state.assignBugsModalOpen
        });
    }

    closeAssignBugsModal() {
        this.setState({
            assignBugsModalOpen: false
        });
    }

    toggleAssginProgrammerModal() {
        this.setState({
            assignProgrammerModalOpen: !this.state.assignProgrammerModalOpen
        });
    }

    closeAssignProgrammerModal() {
        this.setState({
            assignProgrammerModalOpen: false
        });
    }

    removeBug(bugId) {
        let data = new FormData();
        this.props.ticket.bugs.forEach(id => id !== bugId ? data.append('bugs', id) : false);
        this.props.submitForm('remove-bug', '/api/tickets/'+this.props.ticket.id+'/', data, true)
            .then(action => {
                if (action.payload) {
                    this.props.setTicket(action.payload.data);
                }
            });
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
                                        <Numbering
                                            prevId={prevTicketId}
                                            nextId={nextTicketId}
                                            thisIdx={ticketIdx}
                                            size={this.props.tickets.data.length}
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
                                        <h1>#{ticket.id} - {ticket.title}</h1>
                                    </Col>
                                </Row>
                                <Row className="pt-3 border-bottom">
                                    <Col className="mt-md-4 pb-3">
                                        <Detail ticket={ticket}
                                            toggleModal={this.toggleAssginProgrammerModal}
                                        />
                                    </Col>
                                </Row>
                                <Row className="pt-3 border-bottom">
                                    <Description>{ticket.description}</Description>
                                </Row>
                                <Row className="pt-3">
                                    <Attachment file={ticket.attachment} ticketId={ticket.id} />
                                </Row>
                            </Container>
                        </Col>
                        <Col lg="4" xs="12" md="12">
                            <Container>
                                <Row className="mt-1">
                                    <Col>
                                        <h4>Related bugs:</h4>
                                        <BugsContainer toggleModal={this.toggleAssignBugsModal} removeBug={this.removeBug}/>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <Modal isOpen={this.state.assignBugsModalOpen} toggle={this.toggleAssignBugsModal} centered>
                    <ModalHeader toggle={this.toggleAssignBugsModal}>Assign bugs</ModalHeader>
                    <ModalBody>
                        <AssignBugsForm ticket={ticket} closeModal={this.closeAssignBugsModal} />
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.assignProgrammerModalOpen}
                    toggle={this.toggleAssginProgrammerModal}
                >
                    <ModalHeader toggle={this.toggleAssginProgrammerModal}>Assign programmer</ModalHeader>
                    <ModalBody>
                        <AssignProgrammerForm ticket={ticket} closeModal={this.closeAssignProgrammerModal} />
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

TicketInfo = connect(
    (state) => {
        return {
            ticket: state.ticketView.ticketInfo.data,
            tickets: state.ticketView.tickets,
            loading: state.ticketView.ticketInfo.loading,
            error: state.ticketView.ticketInfo.error
        }
    },
    (dispatch) => {
        return {
            getTicket: (ticketId) => dispatch(getTicket(ticketId)),
            setTicketError: (msg) => dispatch(setTicketError(msg)),
            getTicketBug: (id) => dispatch(getTicketBug(id)),
            clearTicketBugs: () => dispatch(clearTicketBugs()),
            cancelActions: (actionType) => dispatch(cancelActionRequests(actionType)),
            submitForm: (id, url, data, edit) => dispatch(submitForm(id, url, data, edit)),
            setTicket: (data) => dispatch(setTicket(data)),
        }
    }
)(TicketInfo);

const Detail = withRouter((props) => {
    const status = props.match.params.status;
    const toPath = pathToRegexp.compile(props.match.path);
    return (
        <>
            <h4>Details</h4>
            <Row>
                <Col md="6" xs="12">
                    <Row className="no-margin">
                        <span className="text-muted">
                            Author:
                        </span>
                        &nbsp;
                        <Link to={"/profile/view/"+props.ticket.author} >{props.ticket.author}</Link>
                    </Row>
                    <Row className="no-margin">
                        <span className="text-muted">
                            Assigned programmer:
                        </span>
                        &nbsp;
                        {props.ticket.expert ?
                            <Link to={"/profile/view/"+props.ticket.expert} >{props.ticket.expert}</Link>
                            :
                            <Badge pill color="primary" className="pointer link" onClick={props.toggleModal}>+ Assign</Badge>
                        }
                    </Row>
                </Col>
                <Col md="6" xs="12">
                    <Row className="no-margin">
                        <span className="text-muted">
                            Status:
                        </span>
                        &nbsp;
                        <Badge color="light" className={'state-bgr-'+props.ticket.status}>
                            {props.ticket.status}
                            {props.ticket.status === 'duplicate' ?
                                <>&nbsp;<Link to={toPath({status: status, id: props.ticket.duplicate})} >#{props.ticket.duplicate}</Link></>
                                :
                                null
                            }
                        </Badge>
                    </Row>
                    <Row className="no-margin">
                        <span className="text-muted">
                            Created:
                        </span>
                        &nbsp;
                        {props.ticket.created}
                    </Row>
                </Col>
            </Row>
        </>
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

function Attachment(props) {
    let fileView = <p className="text-muted">No files attached.</p>;
    if (props.file) {
        const extension = props.file.split('.').pop();
        if (['png', 'jpg', 'bmp', 'jpeg'].includes(extension.toLowerCase())) {
            fileView = <div className="attachment-img">
                <img alt="attachment" src={props.file} className="attachment-preview"/>
                <p><a href={props.file} target="_blank" rel="noopener noreferrer">View attachment</a></p>
            </div>
        } else {
            fileView = <a href={props.file} target="_blank" rel="noopener noreferrer">View attachment</a>;
        }
    }
    return (
      <Col>
          <h4>Attachment</h4>
          {fileView}
      </Col>
    );
}



const BugsContainer = connect(
    state => {
        return {
            loading: state.ticketView.ticketInfo.ticketBugs.loading !== 0,
            error: state.ticketView.ticketInfo.ticketBugs.error,
            data: state.ticketView.ticketInfo.ticketBugs.data
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
            {props.data.map(bug => <Bug bug={bug} key={bug.id} removeBug={props.removeBug} />)}
            {
                props.loading ?
                    <div className="flex-mid mt-4">
                        <Spinner size="2x" />
                    </div>
                    :
                    null
            }
            <RestrictedView minRole={ROLE_PROGRAMMER}>
                <AssignBugBtn onClick={props.toggleModal} />
            </RestrictedView>
        </div>
    );
});

export function Bug(props) {
    return (
        <Card body outline tag={Link} to={'/bugs/'+props.bug.id} className="mb-2 bugs position-relative"
              style={props.bug.severity ?
                  {borderLeft: '5px solid ' + props.bug.severity.color}
                  :
                  null
              }
        >
            <RestrictedView minRole={ROLE_PROGRAMMER}>
                {props.noRemove ? null : <CloseBtn onClick={(e) => {props.removeBug(props.bug.id); e.preventDefault()}} />}
            </RestrictedView>
            <CardTitle>#{props.bug.id} - {props.bug.title}</CardTitle>
            <CardText>
                <small className="text-muted float-left">{props.bug.author}</small>
                <small className="text-muted float-right">{props.bug.created}</small>
            </CardText>
        </Card>
    );
}

function AssignBugBtn(props) {
    return (
        <Card body outline onClick={props.onClick} className="mb-2 bugs card-new-btn">
            <CardText className="text-center">
                <FontAwesomeIcon icon="plus" size="2x" color="rgba(0, 0, 0, 0.1)" className="mt-3 mb-3" />
            </CardText>
        </Card>
    );
}

class AssignBugsForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSuccess = this.handleFormSuccess.bind(this);
    }

    handleFormSuccess(id, data) {
        this.props.setTicket(data);
        this.props.closeModal();
    }

    componentDidMount() {
        this.props.getBugs();
    }

    render() {
        return (
            <Form edit id="assign-bugs-form" url={"/api/tickets/"+this.props.ticket.id+'/'} onSubmitSuccess={this.handleFormSuccess}>
                <StateRenderer state={this.props} renderCondition={this.props.data !== null && this.props.bug}>
                    {props => { return (<>
                        <MultiSearchSelect name="bugs" defaultValue={props.ticket.bugs}>
                            {
                                () => props.data.map(
                                    bug => <MultiSelectItem
                                        key={bug.id}
                                        value={bug.id}
                                        label={"#"+bug.id+" - "+bug.title}
                                    >
                                        {label => {return (
                                            <span className="pl-2"
                                                  style={bug.severity ?
                                                      {borderLeft: '5px solid '+bug.severity.color}
                                                      :
                                                      {borderLeft: '5px solid transparent'}}
                                            >
                                                {label}
                                            </span>
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

AssignBugsForm = connect(
    (state) => {
        return {
            loading: state.bugView.bugs.loading,
            error: state.bugView.bugs.error,
            data: state.bugView.bugs.data
        }
    },
    dispatch => {
        return {
            getBugs: () => dispatch(getBugs()),
            setTicket: (data) => dispatch(setTicket(data))
        }
    }
) (AssignBugsForm);


class AssignProgrammerForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSuccess = this.handleFormSuccess.bind(this);
    }

    handleFormSuccess(id, data) {
        this.props.setTicket(data);

        /*const status = this.props.match.params.status;
        if (!status || status === 'all')
            this.props.getTickets();
        else if (status === 'my')
            this.props.getTickets({username: this.props.username});
        else
            this.props.getTickets({status: status});*/

        this.props.closeModal();
    }

    componentDidMount() {
        this.props.getUsers();
    }

    render() {
        return (
            <Form edit id="assign-programmer-form" url={"/api/tickets/"+this.props.ticket.id+'/'} onSubmitSuccess={this.handleFormSuccess}>
                <StateRenderer state={this.props} renderCondition={this.props.data !== null && this.props.users}>
                    {props => { return (<>
                        <SearchSelect name="expert">
                            {
                                () => props.data.map(
                                    user => <SelectItem
                                        key={user.id}
                                        value={user.username}
                                        label={
                                            user.username +
                                            (user.first_name || user.last_name ?
                                                    " ("+[user.first_name, user.last_name]
                                                        .filter(i => i).join(" ")+")"
                                                    : ""
                                            )
                                        }
                                    />
                                )
                            }
                        </SearchSelect>
                        <Button type="submit" color="primary" className="w-100 mt-4">Assign</Button>
                    </>)}}
                </StateRenderer>
            </Form>
        );
    }
}

AssignProgrammerForm = connect(
    (state) => {
        return {
            loading: state.users.loading,
            error: state.users.error,
            data: state.users.data
        }
    },
    dispatch => {
        return {
            getUsers: () => dispatch(getUsers()),
            setTicket: (data) => dispatch(setTicket(data)),
            getTickets: (query) => dispatch(getTickets(query))
        }
    }
) (withRouter(AssignProgrammerForm));

