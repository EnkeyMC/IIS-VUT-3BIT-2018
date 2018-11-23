import React, { Component } from 'react';
import { NavLink} from "react-router-dom";
import { FormGroup, Input, Button, UncontrolledTooltip} from 'reactstrap';
import {withRouter} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class BugList extends Component {
    render() {
        return (
            <div className="ticket-list content-height position-fixed">
                <SelectForProgrammer/>
                <div className="list-group">
                    <Bug />
                    <Bug />
                </div>
            </div>
        );
    }
}

const Bug = withRouter((props) => {
    return (
        <div className="list-group-item list-group-item-action flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1 ticket-list-title">Nadpis bugu</h6>
            </div>
            <small className="float-left">something</small>
            <small className="float-right">something</small>
        </div>

    );
});

function SelectForUser() {
    return (
        <div className="w-100 pl-2 pr-2 select">
            <FormGroup>
                <Input type="select" name="select" id="exampleSelect">
                    <option>Most recent</option>
                    <option>Oldest</option>
                </Input>
            </FormGroup>
        </div>
    );
}

function SelectForProgrammer() {
    return (
        <div className="w-100 pl-2 select">
            <FormGroup className="d-inline-block w-75">
                <Input type="select" name="select" id="exampleSelect">
                    <option>Most recent</option>
                    <option>Oldest</option>
                </Input>
            </FormGroup>
            <NewBug/>
        </div>
    );
}

function NewBug() {
    return (
        <div className="mr-2 float-right">
            <Button className="bg-red btn-red" id="createBugBtn"><FontAwesomeIcon icon="plus" /></Button>
            <UncontrolledTooltip placement="bottom" target="createBugBtn">
                Create New Bug
            </UncontrolledTooltip>
        </div>
    );
}