import React from 'react';
import {
    Button,
    CardBody,
    CardHeader,
    Col, Container, Row
} from "reactstrap";
import CardContainer from "./CardContainer";
import {Redirect, withRouter} from "react-router";
import {Form, Input, Select} from "./Form";
import {StateRenderer} from "../utils";
import {Link} from "react-router-dom";
import {withAlert} from "react-alert";
import {connect} from "react-redux";

export default function TicketCreate() {
    return (
        <div className="ticket-info content-height">
            <Container>
                <CardContainer>
                    <CardHeader className="h4">
                        Create new ticket
                    </CardHeader>
                    <CardBody>
                        <TicketCreateForm />
                    </CardBody>
                </CardContainer>
            </Container>
        </div>
    );
}


class TicketCreateForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);

        this.state = {
            redirect: false
        };
    }

    handleSubmitSuccess(id, data) {
        this.setState({redirect: true});
        if (data.username !== this.props.loggedUser.username)
            this.props.verifyUser();
        this.props.alert.success("Changes successfully saved.");
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={this.props.location.state ? this.props.location.state.from : '/profile'} />;

        return (
            <Form edit id="create-ticket" url={"/api/tickets/"} onSubmitSuccess={this.handleSubmitSuccess}>
                <p className="text-muted">Fields marked by <span className="text-danger">*</span> are required.</p>
                <Input label={{text: "Title"}} name="title" id="title" required />
                <Input type="textarea" rows="10" label={{text: "Description"}} name="description" id="description" required
                       hint="Please describe the problem in detail with steps to reproduce it, as well as the environment you run the software in."
                />
                <p>TODO: file upload</p>
                <Button type="submit" color="primary" className="w-100 mt-4">Submit</Button>
            </Form>
        );
    }
}

TicketCreateForm = connect(
    (state) => {
        return {
        }
    },
    dispatch => {
        return {
        }
    }
)(withAlert(withRouter(TicketCreateForm)));
