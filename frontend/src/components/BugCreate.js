import CardContainer from "./CardContainer";
import {Button, CardBody, CardHeader, Container} from "reactstrap";
import React from "react";
import {Checkbox, Form, Input, Select} from "./Form";
import {getBugs, getModules, getSeverities, getTickets} from "../actions";
import {withAlert} from "react-alert";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {StateRenderer} from "../utils";
import MultiSearchSelect, {SelectItem} from "./MultiSearchSelect";


export default function BugCreate() {
    return (
        <div className="ticket-info content-height">
            <Container className="mb-5">
                <CardContainer>
                    <CardHeader className="h4">
                        Create new bug
                    </CardHeader>
                    <CardBody>
                        <BugCreateForm />
                    </CardBody>
                </CardContainer>
            </Container>
        </div>
    );
}

class BugCreateForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
    }

    componentDidMount() {
        this.props.getSeverities();
        this.props.getModules();
        this.props.getTickets();
    }

    handleSubmitSuccess() {
        this.props.alert.success("Bug successfully created.");
        const newPath = this.props.location.pathname.replace('/create', '');

        this.props.getBugs();

        this.props.history.push(newPath);
    }

    render() {
        return (
            <Form id="create-bug" url={"/api/bugs/"} onSubmitSuccess={this.handleSubmitSuccess}>
                <StateRenderer state={this.props}
                               renderCondition={
                                   this.props.severities !== null
                                   && this.props.modules !== null
                                   && this.props.tickets !== null}
                >
                    {props => {
                        return  (<>
                            <p className="text-muted">Fields marked by <span className="text-danger">*</span> are required.</p>
                            <Input label={{text: "Title"}} name="title" id="title" required />
                            <Input type="textarea" rows="10" label={{text: "Description"}} name="description" id="description" required />
                            <Select label={{text: "Severity"}} name="severity" id="severity">
                                <option value="" disabled>--- Select severity ---</option>
                                {
                                    props.severities.map(severity => <option value={severity.level} key={severity.level}>{severity.name}</option>)
                                }
                            </Select>
                            <Checkbox label={{text: "Vulnerability"}} name="vulnerability" id="vulnerability" />
                            <Select label={{text: "Module"}} name="module" id="module">
                                <option value="" disabled>--- Select module ---</option>
                                {
                                    props.modules.map(module => <option value={module.id} key={module.id}>{module.name}</option>)
                                }
                            </Select>
                            <MultiSearchSelect label={{text: "Assign tickets"}} name="tickets">
                                {
                                    () => props.tickets.map(
                                        ticket => <SelectItem
                                            key={ticket.id}
                                            value={ticket.id}
                                            label={"#"+ticket.id+" - "+ticket.title}
                                        >
                                            {label => {return (
                                                <span className={"pl-2 state-"+ticket.status}>{label}</span>
                                            )}}
                                        </SelectItem>
                                    )
                                }
                            </MultiSearchSelect>
                            <Button type="submit" color="primary" className="w-100 mt-4">Submit</Button>
                        </>);
                    }}
                </StateRenderer>
            </Form>
        );
    }
}

BugCreateForm = connect(
    state => {
        return {
            severities: state.severities.data,
            modules: state.modules.data,
            tickets: state.ticketView.tickets.data,
            loading: state.severities.loading || state.modules.loading || state.ticketView.tickets.loading,
            error: state.severities.error ? state.severities.error : (state.modules.error ? state.modules.error : state.ticketView.tickets.error)
        }
    },
    dispatch => {
        return {
            getBugs: () => dispatch(getBugs()),
            getSeverities: () => dispatch(getSeverities()),
            getModules: () => dispatch(getModules()),
            getTickets: () => dispatch(getTickets())
        }
    }
) (withAlert(withRouter(BugCreateForm)));