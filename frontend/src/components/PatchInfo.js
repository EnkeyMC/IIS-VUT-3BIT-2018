import React, {Component} from 'react';
import {
    Col, Container, Row, CardColumns,
    Card, CardTitle, CardText, CardBody, Badge
} from "reactstrap";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Error from "./Error";
import {ConditionView, EntityAction, Spinner} from "../utils";
import {withRouter} from "react-router";
import {GET_PATCH, getFilteredPatches, getPatch, setPatchError} from "../actions/patches";
import Observable from "../utils/Observable";
import {cancelActionRequests} from "../actions/global";
import PatchView from "../views/PatchesView";
import {RestrictedView, ROLE_SUPERVISOR} from "./RoleRestriction";
import * as pathToRegexp from "path-to-regexp";
import {submitForm} from "../actions";
import {withAlert} from "react-alert";
import confirm from 'reactstrap-confirm';


export default class PatchInfo extends Component {
    constructor(props) {
        super(props);

        this.idObservable = new Observable(this.getPatchId(), val => {
            if (val)
                this.props.getPatch(val);
            else {
                this.props.cancelActions(GET_PATCH);
                this.props.setPatchError("Nothing to show");
            }
        });

        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.releasePatch = this.releasePatch.bind(this);
    }

    componentDidMount() {
        this.idObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.idObservable.update(this.getPatchId());
    }

    getPatchId() {
        return this.props.match.params.id ? this.props.match.params.id : this.props.defaultId;
    }

    async releasePatch() {
        let confirmation = await confirm({
            message: "Are you sure you want to release patch? You cannot undo this operation!",
            confirmText: "Release",
            confirmColor: "success"
        });

        if (confirmation)
            this.setPatchStatus('released');
    }

    setPatchStatus(status) {
        let formData = new FormData();
        formData.append('status', status);
        this.props.submitForm(
            'request-approval-form',
            '/api/patches/'+this.getPatchId(),
            formData,
            true
        ).then(this.handleSubmitForm);
    }

    handleSubmitForm(action) {
        if (action.payload) {
            this.idObservable.triggerOnChanged();
            this.props.getFilteredPatches(this.props.match.params.status);
        } else if (action.error) {
            if (action.error.response && action.error.response.data.status)
                this.props.alert.error(action.error.response.data.status);
            else if (action.error.response && action.error.response.data.detail)
                this.props.alert.error(action.error.response.data.detail);
            else
                this.props.alert.error(action.error.message);
        }
    }

    render() {
        const patch = this.props.patch;
        if (patch.loading) {
            return (
                <div className="info content-height flex-mid">
                    <Spinner size="5x" />
                </div>
            );
        }

        if (patch.error) {
            return (
                <div className="info content-height flex-mid">
                    <Error>
                        {this.props.error}
                    </Error>
                </div>
            );
        }

        if (patch.data === null)
            return null;

        const toPath = pathToRegexp.compile(this.props.match.path);
        const path = toPath({
            status: this.props.match.params.status,
            id: this.getPatchId()
        });

        const user = this.props.loggedInUser;

        return (
            <div className="info content-height">
                <Container>
                    <Row className="mt-5">
                        <Col lg="12" xs="12" md="12">
                            <Container>
                                <Row>
                                    <Col>
                                        <h1>#{patch.data.id} - {patch.data.name}</h1>
                                    </Col>
                                </Row>
                                <Row className="pt-3">
                                    <Col>
                                        <ConditionView if={user && user.username === patch.data.author}>
                                            <EntityAction linkTo={path+'/edit'} icon="edit">Edit</EntityAction>
                                        </ConditionView>
                                        <ConditionView if={user && user.username === patch.data.author && patch.data.status === 'in progress'}>
                                            <EntityAction onClick={() => this.setPatchStatus('awaiting approval')} icon="concierge-bell">Request approval</EntityAction>
                                        </ConditionView>
                                        <ConditionView if={user && user.username === patch.data.author && patch.data.status === 'awaiting approval'}>
                                            <EntityAction onClick={() => this.setPatchStatus('in progress')} icon="times">Cancel approval request</EntityAction>
                                        </ConditionView>
                                        <ConditionView if={user && patch.data.bugs.find(bug => bug.module ? bug.module.expert === user.username : false) && patch.data.status === 'awaiting approval'}>
                                            <EntityAction onClick={() => this.setPatchStatus('approved')} className="text-success" icon="thumbs-up">Approve</EntityAction>
                                        </ConditionView>
                                        <RestrictedView minRole={ROLE_SUPERVISOR}>
                                            <ConditionView if={patch.data.status === 'approved'}>
                                                <EntityAction onClick={this.releasePatch} icon="hand-point-right">Release</EntityAction>
                                            </ConditionView>
                                        </RestrictedView>
                                    </Col>
                                </Row>
                                <Row className="pt-3 border-bottom">
                                    <Col className="mt-md-4 pb-3">
                                        <Detail patch={patch.data} />
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col lg="12" xs="12" md="12">
                            <Container className="mt-5">
                                <h4 className="mb-3">Fixes bugs:</h4>
                                <CardColumns className="patch-columns">
                                    {patch.data.bugs.map(bug => <BugCard key={bug.id} bug={bug} />)}
                                </CardColumns>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

PatchInfo = connect(
    state => {
        return {
            patch: state.patch,
            loggedInUser: state.global.user
        }
    },
    dispatch => {
        return {
            getPatch: (id) => dispatch(getPatch(id)),
            setPatchError: msg => dispatch(setPatchError(msg)),
            cancelActions: action => dispatch(cancelActionRequests(action)),
            submitForm: (id, url, data, edit) => dispatch(submitForm(id, url, data, edit)),
            getFilteredPatches: (filter) => dispatch(getFilteredPatches(filter)),
        }
    }
)(withRouter(withAlert(PatchInfo)));

const Detail = withRouter((props) => {
    // const status = props.match.params.status;
    // const toPath = pathToRegexp.compile(props.match.path);
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
                        <Link to={'/profile/view/'+props.patch.author}>{props.patch.author}</Link>
                    </Row>
                    <Row className="no-margin">
                        <span className="text-muted">
                            Status:
                        </span>
                        &nbsp;
                        <Badge color="light" className={"state-bgr-"+PatchView.statusEncode(props.patch.status)} >
                            {props.patch.status}
                        </Badge>
                    </Row>
                </Col>
                <Col md="6" xs="12">
                    <Row className="no-margin">
                        <span className="text-muted">
                            Created:
                        </span>
                        &nbsp;
                        {props.patch.date_created}
                    </Row>
                    <Row className="no-margin">
                        <span className="text-muted">
                            Released:
                        </span>
                        &nbsp;
                        <ConditionView render={props.patch.date_released} else="Not released yet" />
                    </Row>
                </Col>
            </Row>
        </>
    );
});

const BugCard = withRouter((props) => {
    return (
        <Card tag={Link} to={'/bugs/'+props.bug.id} className="mb-2 bugs position-relative"
             style={props.bug.severity ?
                 {borderLeft: '5px solid ' + props.bug.severity.color}
                 :
                 null
             }
        >
            <CardBody>
                <CardTitle>
                    #{props.bug.id} - {props.bug.title}
                </CardTitle>
                <CardText className="clearfix border-bottom pb-3">
                    <small className="text-muted float-left">{props.bug.author}</small>
                    <small className="text-muted float-right">{props.bug.created}</small>
                </CardText>
                <div>
                    <span className="mr-2 text-muted">Module:</span>
                    &nbsp;
                    {props.bug.module ? props.bug.module.name : null}
                </div>
            </CardBody>
        </Card>
    );
});