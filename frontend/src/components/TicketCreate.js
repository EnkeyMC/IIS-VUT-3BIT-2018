import React from 'react';
import {
    Button,
    CardBody,
    CardHeader,
    Container
} from "reactstrap";
import CardContainer from "./CardContainer";
import {withRouter} from "react-router";
import {Form, Input} from "./Form";
import {withAlert} from "react-alert";
import {connect} from "react-redux";
import {getTickets} from "../actions";
import MultiSearchSelect from "./MultiSearchSelect";

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
    }

    handleSubmitSuccess(id, data) {
        this.props.alert.success("Ticket successfully created.");
        const newPath = this.props.location.pathname.replace('/create', '');

        if (newPath.endsWith('/new'))
            this.props.getTickets('new');
        else if (newPath.endsWith('/closed'))
            this.props.getTickets('closed');
        else if (newPath.endsWith('/my'))
            this.props.getUserTickets(this.props.username);
        else if (newPath.endsWith('/assigned'))
            this.props.getTickets('assigned');
        else
            this.props.getTickets();

        this.props.history.push(newPath);
    }

    render() {
        return (
            <Form id="create-ticket" url={"/api/tickets/"} onSubmitSuccess={this.handleSubmitSuccess}>
                <p className="text-muted">Fields marked by <span className="text-danger">*</span> are required.</p>
                <Input label={{text: "Title"}} name="title" id="title" required />
                <Input type="textarea" rows="10" label={{text: "Description"}} name="description" id="description" required
                       hint="Please describe the problem in detail with steps to reproduce it, as well as the environment you run the software in."
                />
                <Input type="hidden" name="attachment" />
                <p>TODO: file upload</p>
                <Button type="submit" color="primary" className="w-100 mt-4">Submit</Button>
            </Form>
        );
    }
}

TicketCreateForm = connect(
    null,
    dispatch => {
        return {
            getTickets: (state = null) => dispatch(getTickets(state))
        }
    }
) (withAlert(withRouter(TicketCreateForm)));
