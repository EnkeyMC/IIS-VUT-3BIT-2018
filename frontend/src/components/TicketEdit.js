import React, {Component} from 'react';
import CardContainer from "./CardContainer";
import {Form, RequiredFieldsNotice} from "./form/Form";
import {Input} from "./form/Input";
import {FileDrop} from "./form/FileDrop";
import {getTicket, getTickets} from "../actions";
import {withAlert} from "react-alert";
import {withRouter} from "react-router";
import {StateRenderer} from "../utils";
import {RestrictedRoute, ROLE_PROGRAMMER} from "./RoleRestriction";
import {Link} from "react-router-dom";
import {Button, CardBody, CardHeader, Col, Container, Row} from "reactstrap";
import {connect} from "react-redux";

export default class TicketEdit extends Component {
    componentDidMount() {
        this.props.getTicket(this.props.match.params.id);
    }

    render() {
        return (
            <div className="ticket-info content-height">
                <Container>
                    <CardContainer>
                        <CardHeader className="h4">
                            Edit ticket
                        </CardHeader>
                        <CardBody>
                            <StateRenderer state={this.props.ticket} renderCondition={this.props.ticket.data !== null}>
                                {ticket => {return (
                                    <RestrictedRoute minRole={ROLE_PROGRAMMER} reqUser={ticket.data.author}>
                                        <TicketEditForm ticket={ticket.data}/>
                                    </RestrictedRoute>
                                )}}
                            </StateRenderer>
                        </CardBody>
                    </CardContainer>
                </Container>
            </div>
        );
    }
}

TicketEdit = connect(
    state => {
        return {
            ticket: state.ticketView.ticketInfo
        }
    },
    dispatch => {
        return {
            getTicket: (id) => dispatch(getTicket(id))
        }
    }
)(TicketEdit);


class TicketEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
    }

    handleSubmitSuccess(id, data) {
        this.props.alert.success("Changes saved successfully.");
        const newPath = this.props.location.pathname.replace('/edit', '');

        const status = this.props.match.params.status;
        if (!status || status === 'all')
            this.props.getTickets();
        else if (status === 'my')
            this.props.getTickets({username: this.props.username});
        else
            this.props.getTickets({status: status});

        this.props.history.push(newPath);
    }

    render() {
        const ticket = this.props.ticket;
        const newPath = this.props.location.pathname.replace('/edit', '');
        return (
            <Form edit id="edit-ticket" url={"/api/tickets/"+ticket.id+'/'} onSubmitSuccess={this.handleSubmitSuccess}>
                <RequiredFieldsNotice />
                <Input label="Title" name="title" id="title" required defaultValue={ticket.title}/>
                <Input type="textarea" rows="10" label="Description" name="description" id="description" required defaultValue={ticket.description}
                       hint="Please describe the problem in detail with steps to reproduce it, as well as the environment you run the software in."
                />
                <FileDrop label="Attachment" name="attachment" id="attachment" accept="text/*, image/*"
                          hint="Attach image or text file that can help us resolve your issue. Max file size is 1 MB."
                          className="dropzone pt-5 pb-5 text-muted"
                          activeClassName="dropzone-success"
                          rejectClassName="dropzone-reject"
                />
                <Row form>
                    <Col md="4">
                        <Button
                            tag={Link}
                            to={newPath}
                            color="secondary"
                            className="w-100 mt-4"
                        >
                            Cancel
                        </Button>
                    </Col>
                    <Col md="8">
                        <Button
                            type="submit"
                            color="primary"
                            className="w-100 mt-4"
                        >
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

TicketEditForm = connect(
    state => {
        return {
            username: state.global.user ? state.global.user.username : null
        }
    },
    dispatch => {
        return {
            getTickets: (query = null) => dispatch(getTickets(query))
        }
    }
) (withAlert(withRouter(TicketEditForm)));
