import React, {Component} from 'react';
import {
    Col, Container, Row,
    Card, CardTitle, CardText, Badge, Modal, ModalHeader, ModalBody, Button
} from "reactstrap";
import {connect} from "react-redux";
import {
    submitForm
} from '../actions';
import {Link} from "react-router-dom";
import Error from "./Error";
import {ConditionView, EntityAction, Spinner, StateRenderer} from "../utils";
import Observable from "../utils/Observable";
import pathToRegexp from 'path-to-regexp';
import {withRouter} from "react-router";
import {Numbering} from "./Numbering";
import CloseBtn from "./CloseBtn";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Lightbox from "react-lightbox-component";
import {Form} from "./form/Form";
import MultiSearchSelect, {MultiSelectItem} from "./form/MultiSearchSelect";
import {RestrictedView, ROLE_PROGRAMMER, ROLE_SUPERVISOR} from "./RoleRestriction";
import {SelectItem} from "./form/SearchSelect";
import SearchSelect from "./form/SearchSelect";
import {cancelActionRequests} from "../actions/global";
import {
    clearTicketBugs, GET_TICKET,
    GET_TICKET_BUG,
    getTicket,
    getTicketBug,
    getTickets, getTicketsForSelect,
    setTicket,
    setTicketError
} from "../actions/tickets";
import {getUsers} from "../actions/users";
import {getBugs} from "../actions/bugs";
import {withAlert} from "react-alert";


export default class TicketInfo extends Component {
    constructor(props) {
        super(props);

        this.ticketIdObservable = new Observable(
            this.getTicketId(),
            newValue => {
                if (newValue)
                    this.props.getTicket(newValue);
                else {
                    this.props.cancelActions(GET_TICKET);
                    this.props.setTicketError("Nothing to show");
                }
            }
        );

        this.ticketObservable = new Observable(
            this.props.ticket,
            newValue => {
                if (newValue)
                    this.requestBugs();
            }
        );

        this.state = {
            assignBugsModalOpen: false,
            assignProgrammerModalOpen: false,
            duplicateModalOpen: false,
        };

        this.closeAssignProgrammerModal = this.closeAssignProgrammerModal.bind(this);
        this.toggleAssignProgrammerModal = this.toggleAssignProgrammerModal.bind(this);
        this.toggleAssignBugsModal = this.toggleAssignBugsModal.bind(this);
        this.closeAssignBugsModal = this.closeAssignBugsModal.bind(this);
        this.removeBug = this.removeBug.bind(this);
        this.toggleDuplicateModal = this.toggleDuplicateModal.bind(this);
        this.closeDuplicateModal = this.closeDuplicateModal.bind(this);
    }

    componentDidMount() {
        this.ticketIdObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.ticketIdObservable.update(this.getTicketId());
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

    toggleAssignProgrammerModal() {
        this.setState({
            assignProgrammerModalOpen: !this.state.assignProgrammerModalOpen
        });
    }

    closeAssignProgrammerModal() {
        this.setState({
            assignProgrammerModalOpen: false
        });
    }

    toggleDuplicateModal() {
        this.setState({
            duplicateModalOpen: !this.state.duplicateModalOpen
        });
    }

    closeDuplicateModal() {
        this.setState({
            duplicateModalOpen: false
        });
    }

    removeBug(bugId) {
        let data = new FormData();
        this.props.ticket.bugs.forEach(id => id !== bugId ? data.append('bugs', id) : false);
        if (!data.has('bugs'))
            data.append('bugs', "");
        this.props.submitForm('remove-bug', '/api/tickets/'+this.props.ticket.id+'/', data, 'patch')
            .then(action => {
                if (action.payload) {
                    this.props.setTicket(action.payload.data);
                } else if (action.error) {
                    if (action.error.response && action.error.response.data.bugs)
                        this.props.alert.error("You cannot remove this bug.");
                    else if (action.error.response && action.error.response.data.detail)
                        this.props.alert.error(action.error.response.data.detail);
                    else
                        this.props.alert.error(action.error.message);

                }
            });
    }

    render() {
        const ticket = this.props.ticket;

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

        const toPath = pathToRegexp.compile(this.props.match.path);
        const path = toPath({
            status: this.props.match.params.status,
            id: this.getTicketId()
        });

        return (
            <div className="info content-height">
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
                                        <h1>
                                            #{ticket.id} - {ticket.title}
                                        </h1>
                                        <ConditionView if={ticket.reward !== "0.00"}><Badge color="light">Reward: &euro;{ticket.reward}</Badge></ConditionView>
                                    </Col>
                                </Row>
                                <Row className="pt-3">
                                    <Col>
                                        <RestrictedView reqUser={ticket.author} minRole={ROLE_SUPERVISOR}>
                                            <EntityAction linkTo={path+'/edit'} icon="edit">Edit</EntityAction>
                                        </RestrictedView>
                                        <RestrictedView minRole={ROLE_PROGRAMMER}>
                                            <EntityAction onClick={this.toggleDuplicateModal} icon="marker">Mark as duplicate</EntityAction>
                                        </RestrictedView>
                                    </Col>
                                </Row>
                                <Row className="pt-3 border-bottom">
                                    <Col className="mt-md-4 pb-3">
                                        <Detail ticket={ticket}
                                            toggleModal={this.toggleAssignProgrammerModal}
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
                    toggle={this.toggleAssignProgrammerModal}
                >
                    <ModalHeader toggle={this.toggleAssignProgrammerModal}>Assign programmer</ModalHeader>
                    <ModalBody>
                        <AssignProgrammerForm ticket={ticket} closeModal={this.closeAssignProgrammerModal} />
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.duplicateModalOpen}
                       toggle={this.toggleDuplicateModal}
                >
                    <ModalHeader toggle={this.toggleDuplicateModal}>Select duplicate</ModalHeader>
                    <ModalBody>
                        <DuplicateForm ticket={ticket} closeModal={this.closeDuplicateModal} />
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
)(withAlert(TicketInfo));

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
                            <RestrictedView minRole={ROLE_SUPERVISOR}>
                                <Badge pill color="primary" className="pointer link" onClick={props.toggleModal}>+ Assign</Badge>
                            </RestrictedView>
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
                <Lightbox images={[{
                            src: props.file,
                            title: ' ',
                            description: ' ' }]}
                          showImageModifiers={true}
                          thumbnailWidth='auto'
                          thumbnailHeight='auto'
                />
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
            <Form method="put" id="assign-bugs-form"
                  url={"/api/tickets/"+this.props.ticket.id+'/'}
                  onSubmitSuccess={this.handleFormSuccess}
            >
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
        this.beforeSubmit = this.beforeSubmit.bind(this);
    }

    handleFormSuccess(id, data) {
        this.props.setTicket(data);

        const status = this.props.match.params.status;
        if (!status || status === 'all')
            this.props.getTickets();
        else if (status === 'my')
            this.props.getTickets({username: this.props.username});
        else
            this.props.getTickets({status: status});

        this.props.closeModal();
    }

    componentDidMount() {
        this.props.getUsers();
    }

    beforeSubmit(state) {
        if (!state.fields["expert"].value) {
            this.props.closeModal();
            return false;
        }

        return true;
    }

    render() {
        return (
            <Form method="patch" id="assign-programmer-form"
                  url={"/api/tickets/"+this.props.ticket.id+'/'}
                  onSubmitSuccess={this.handleFormSuccess}
                  beforeSubmit={this.beforeSubmit}
            >
                <StateRenderer state={this.props} renderCondition={this.props.data !== null}>
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


class DuplicateForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSuccess = this.handleFormSuccess.bind(this);
        this.beforeSubmit = this.beforeSubmit.bind(this);
    }

    handleFormSuccess(id, data) {
        this.props.setTicket(data);

        const status = this.props.match.params.status;
        if (!status || status === 'all')
            this.props.getTickets();
        else if (status === 'my')
            this.props.getTickets({username: this.props.username});
        else
            this.props.getTickets({status: status});

        this.props.closeModal();
    }

    componentDidMount() {
        this.props.getTicketsForSelect();
    }

    beforeSubmit(state) {
        if (!state.fields["duplicate"].value) {
            this.props.closeModal();
            return false;
        }

        return true;
    }

    render() {
        return (
            <Form method="patch" id="mark-as-duplicate-form"
                  url={"/api/tickets/"+this.props.ticket.id+'/'}
                  onSubmitSuccess={this.handleFormSuccess}
                  beforeSubmit={this.beforeSubmit}
            >
                <StateRenderer state={this.props} renderCondition={this.props.data !== null}>
                    {props => { return (<>
                        <SearchSelect name="duplicate">
                            {
                                () => props.data.map(
                                    ticket => <SelectItem
                                        key={ticket.id}
                                        value={ticket.id}
                                        label={'#'+ticket.id + ' ' +ticket.title}
                                    >
                                        {
                                            label => {return (
                                                <span className={"pl-2 state-"+ticket.status}>{label}</span>
                                            )}
                                        }
                                    </SelectItem>
                                )
                            }
                        </SearchSelect>
                        <Button type="submit" color="primary" className="w-100 mt-4">Submit</Button>
                    </>)}}
                </StateRenderer>
            </Form>
        );
    }
}

DuplicateForm = connect(
    (state) => {
        return {
            loading: state.ticketView.ticketInfo.ticketsForSelect.loading,
            error: state.ticketView.ticketInfo.ticketsForSelect.error,
            data: state.ticketView.ticketInfo.ticketsForSelect.data
        }
    },
    dispatch => {
        return {
            getTicketsForSelect: () => dispatch(getTicketsForSelect()),
            setTicket: (data) => dispatch(setTicket(data)),
            getTickets: (query) => dispatch(getTickets(query))
        }
    }
) (withRouter(DuplicateForm));
