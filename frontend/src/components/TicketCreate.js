import React from 'react';
import {
    Button,
    CardBody,
    CardHeader,
    Container
} from "reactstrap";
import CardContainer from "./CardContainer";
import {withRouter} from "react-router";
import {Form, RequiredFieldsNotice} from "./form/Form";
import {withAlert} from "react-alert";
import {connect} from "react-redux";
import {getTickets} from "../actions/tickets";
import {Input} from "./form/Input";
import {FileDrop} from "./form/FileDrop";

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

        const status = this.props.match.params.status;
        if (!status || status === 'all')
            this.props.getTickets();
        else if (status === 'my')
            this.props.getTickets({username: this.props.username});
        else
            this.props.getTickets({status: status});

        this.props.history.push(newPath + '/' + data.id);
    }

    render() {
        return (
            <Form id="create-ticket" url="/api/tickets/" onSubmitSuccess={this.handleSubmitSuccess}>
                <RequiredFieldsNotice />
                <Input label="Title" name="title" id="title" required />
                <Input type="textarea" rows="10" label="Description" name="description" id="description" required
                       hint="Please describe the problem in detail with steps to reproduce it, as well as the environment you run the software in."
                />
                <FileDrop label="Attachment" name="attachment" id="attachment" accept="text/*, image/*"
                          hint="Attach image or text file that can help us resolve your issue. Max file size is 1 MB."
                          className="dropzone pt-5 pb-5 text-muted"
                          activeClassName="dropzone-success"
                          rejectClassName="dropzone-reject"
                />
                <Button type="submit" color="primary" className="w-100 mt-4">Submit</Button>
            </Form>
        );
    }
}

TicketCreateForm = connect(
    null,
    dispatch => {
        return {
            getTickets: (query = null) => dispatch(getTickets(query))
        }
    }
) (withAlert(withRouter(TicketCreateForm)));
