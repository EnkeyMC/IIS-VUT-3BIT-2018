import React from "react";
import {Form, RequiredFieldsNotice} from "./form/Form";
import {withAlert} from "react-alert";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {copyMerge, StateRenderer} from "../utils";
import MultiSearchSelect, {MultiSelectItem} from "./form/MultiSearchSelect";
import {Input} from "./form/Input";
import {Button} from "reactstrap";
import {getBugs} from "../actions/bugs";
import {getFilteredPatches} from "../actions/patches";

export default class PatchForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
    }

    componentDidMount() {
        this.props.getBugs();
    }

    handleSubmitSuccess(id, data) {
        let newPath;
        const location = this.props.location;
        if (this.props.patch) {
            this.props.alert.success("Changes successfully saved.");
            newPath = location.pathname.replace('/edit', '/') + location.search;
        } else {
            this.props.alert.success("Patch successfully created.");
            newPath = location.pathname.replace('/create', '/'+data.id) + location.search;
        }

        this.props.getFilteredPatches(this.props.match.params.status);

        this.props.history.push(newPath);
    }

    render() {
        let patch = this.props.patch ? copyMerge(this.props.patch) : null;
        let formProps = {
            edit: false,
            url: "/api/patches/",
            id: "create-patch"
        };

        if (!patch) {
            patch = {
                name: "",
                bugs: [],
                status: "in progress"
            };
        } else {
            formProps = {
                edit: true,
                url: "/api/patches/"+patch.id+"/",
                id: "edit-patch"
            };
            patch.bugs = patch.bugs.map(bug => bug.id);
        }

        return (
            <Form {...formProps} onSubmitSuccess={this.handleSubmitSuccess}>
                <StateRenderer state={this.props}
                               renderCondition={
                                   this.props.bugs !== null
                               }
                >
                    {props => {
                        return  (<>
                            <RequiredFieldsNotice/>
                            <Input label="Name" name="name" id="name" required defaultValue={patch.name} />
                            <MultiSearchSelect label="Patching bugs" name="bugs" defaultValue={patch.bugs}>
                                {
                                    () => props.bugs.map(
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
                            <Button type="submit" color="primary" className="w-100 mt-4">Submit</Button>
                        </>);
                    }}
                </StateRenderer>
            </Form>
        );
    }
}

PatchForm = connect(
    state => {
        return {
            bugs: state.bugView.bugs.data,
            loading: state.bugView.bugs.loading,
            error: state.bugView.bugs.error
        }
    },
    dispatch => {
        return {
            getBugs: () => dispatch(getBugs()),
            getFilteredPatches: (filter) => dispatch(getFilteredPatches(filter))
        }
    }
) (withAlert(withRouter(PatchForm)));