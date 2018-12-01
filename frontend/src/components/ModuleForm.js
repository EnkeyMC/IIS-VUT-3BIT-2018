import React from "react";
import {Form, RequiredFieldsNotice} from "./form/Form";
import {StateRenderer} from "../utils";
import {Input} from "./form/Input";
import SearchSelect, {SelectItem} from "./form/SearchSelect";
import MultiSearchSelect, {MultiSelectItem} from "./form/MultiSearchSelect";
import {Link} from "react-router-dom";
import {getLanguages, getUsers} from "../actions";
import {withAlert} from "react-alert";
import {withRouter} from "react-router";
import {Button, Col, Row} from "reactstrap";
import {connect} from "react-redux";

export default class ModuleForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
    }

    componentDidMount() {
        this.props.getLanguages();
        this.props.getUsers({position: ['programmer', 'supervisor']});
    }

    handleSubmitSuccess(id, data) {
        if (this.props.module)
            this.props.alert.success("Changes successfully saved.");
        else
            this.props.alert.success("Module created successfully.");

        this.props.history.push('/modules');
    }

    render() {
        let module = this.props.module;
        const formProps = {
            edit: this.props.module ? true : false,
            url: module ? "/api/modules/"+module.id+"/" : "/api/modules/",
            id: module ? "edit-module" : "create-module"
        };

        if (!module) {
            module = {
                name: "",
                description: "",
                languages: [],
                expert: null,
            };
        }

        return (
            <Form {...formProps} onSubmitSuccess={this.handleSubmitSuccess}>
                <StateRenderer
                    state={this.props}
                    renderCondition={
                        this.props.languages !== null
                        && this.props.users !== null
                    }
                >
                    {props => {return (
                        <>
                            <RequiredFieldsNotice />
                            <Input label="Name" name="name" id="name" defaultValue={module.name} required />
                            <Input type="textarea" rows="5" label="Description" name="description" id="description" defaultValue={module.description} required />
                            <SearchSelect name="expert" label="Expert" defaultValue={module.expert}>
                                {
                                    () => props.users.map(
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
                            <MultiSearchSelect label="Programming languages" name="languages" id="languages" defaultValue={module.languages}>
                                {() => props.languages.map(item => <MultiSelectItem value={item.name} key={item.id} label={item.name} />)}
                            </MultiSearchSelect>
                            <Row form>
                                <Col md="4">
                                    <Button
                                        tag={Link}
                                        to="/modules"
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
                        </>
                    )}}

                </StateRenderer>
            </Form>
        );
    }
}

ModuleForm = connect(
    state => {
        return {
            languages: state.languages.data,
            users: state.users.data,
            loading: state.languages.loading || state.users.loading,
            error: state.languages.error ? state.languages.error : state.users.error
        }
    },
    dispatch => {
        return {
            getLanguages: () => dispatch(getLanguages()),
            getUsers: (query) => dispatch(getUsers(query))
        }
    }
)(withAlert(withRouter(ModuleForm)));