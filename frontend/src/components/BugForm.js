import React from "react";
import {Form} from "./form/Form";
import {getModules} from "../actions/modules";
import {withAlert} from "react-alert";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {StateRenderer} from "../utils";
import MultiSearchSelect, {MultiSelectItem} from "./form/MultiSearchSelect";
import {Input} from "./form/Input";
import {Select} from "./form/Select";
import {Checkbox} from "./form/Checkbox";
import {Button} from "reactstrap";
import {getTickets} from "../actions/tickets";
import {getBugs} from "../actions/bugs";
import {getSeverities} from "../actions/severities";

export default class BugForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
    }

    componentDidMount() {
        this.props.getSeverities();
        this.props.getModules();
        this.props.getTickets();
    }

    handleSubmitSuccess(id, data) {
        let newPath;
        if (this.props.bug) {
            this.props.alert.success("Changes successfully saved.");
            newPath = this.props.location.pathname.replace('/edit', '');
        } else {
            this.props.alert.success("Bug successfully created.");
            newPath = this.props.location.pathname.replace('/create', '/'+data.id);
        }

        this.props.getBugs();

        this.props.history.push(newPath);
    }

    render() {
        let bug = this.props.bug;
        let formProps = {
            edit: false,
            url: "/api/bugs/",
            id: "create-bug"
        };

        if (!bug) {
            bug = {
                title: "",
                description: "",
                severity: "",
                vulnerability: false,
                module: "",
                tickets: []
            };
        } else {
            formProps = {
                edit: true,
                url: "/api/bugs/"+bug.id+"/",
                id: "edit-bug"
            };
        }

        return (
            <Form {...formProps} onSubmitSuccess={this.handleSubmitSuccess}>
                <StateRenderer state={this.props}
                               renderCondition={
                                   this.props.severities !== null
                                   && this.props.modules !== null
                                   && this.props.tickets !== null}
                >
                    {props => {
                        return  (<>
                            <p className="text-muted">Fields marked by <span className="text-danger">*</span> are required.</p>
                            <Input label="Title" name="title" id="title" required defaultValue={bug.title} />
                            <Input type="textarea" rows="10" label="Description" name="description" id="description" required defaultValue={bug.description} />
                            <Select label="Severity" name="severity" id="severity" defaultValue={bug.severity}>
                                <option value="" disabled>--- Select severity ---</option>
                                {
                                    props.severities.map(severity => <option value={severity.level} key={severity.level}>{severity.name}</option>)
                                }
                            </Select>
                            <Checkbox label="Vulnerability" name="vulnerability" id="vulnerability" defaultValue={bug.vulnerability} />
                            <Select label="Module" name="module" id="module" defaultValue={bug.module}>
                                <option value="" disabled>--- Select module ---</option>
                                {
                                    props.modules.map(module => <option value={module.id} key={module.id}>{module.name}</option>)
                                }
                            </Select>
                            <MultiSearchSelect label="Assign tickets" name="tickets" defaultValue={bug.tickets}>
                                {
                                    () => props.tickets.map(
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
                            <Button type="submit" color="primary" className="w-100 mt-4">Submit</Button>
                        </>);
                    }}
                </StateRenderer>
            </Form>
        );
    }
}

BugForm = connect(
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
) (withAlert(withRouter(BugForm)));