import React, {Component} from 'react';
import {
    Col, Container, Row, CardColumns,
    Card, CardTitle, CardText, CardBody
} from "reactstrap";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Error from "./Error";
import {Spinner, StateRenderer} from "../utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Numbering} from "./Numbering";
import pathToRegexp from 'path-to-regexp';
import {RestrictedView, ROLE_PROGRAMMER, ROLE_SUPERVISOR} from "./RoleRestriction";
import {withRouter} from "react-router";
import {getFilteredPatches} from "../actions/patches";
import Observable from "../utils/Observable";


export default class PatchInfo extends Component {
    constructor(props) {
        super(props);

        this.statusObservable = new Observable(this.props.match.params.status, val => {
            this.props.getFilteredPatches(PatchInfo.statusDecode(val));
        });
    }

    componentDidMount() {
        this.statusObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.statusObservable.update(this.props.match.params.status);
    }

    static statusEncode(status) {
        return status.replace(' ', '-');
    }

    static statusDecode(status) {
        return status.replace('-', ' ');
    }

    render() {
        const patch = this.props.patches;
        if (this.props.loading) {
            return (
                <div className="info content-height flex-mid">
                    <Spinner size="5x" />
                </div>
            );
        }

        if (this.props.error) {
            return (
                <div className="info content-height flex-mid">
                    <Error>
                        {this.props.error}
                    </Error>
                </div>
            );
        }

        // let prevTicketId, nextTicketId, idx, ticketIdx;
        // for (idx = 0; idx < this.props.patches.data.length; idx++) {
        //     if (String(this.props.patches.data[idx].id) === String(this.getTicketId())) {
        //         ticketIdx = idx+1;
        //         break;
        //     }
        //     prevTicketId = this.props.patches.data[idx].id;
        // }
        // ++idx;
        // nextTicketId = this.props.patches.data[idx] ? this.props.patches.data[idx].id : undefined;

        // const toPath = pathToRegexp.compile(this.props.match.path);
        // const path = toPath({
        //     status: this.props.match.params.status,
        //     id: this.getFilteredPatches()
        // });

        return (
            <div className="info content-height">
                <Container>
                    <Row className="mb-3">
                        <Col className="pt-1 text-right">
                            <Container>
                                <Row>
                                    <Col>
                                        {/*<Numbering*/}
                                            {/*prevId={prevTicketId}*/}
                                            {/*nextId={nextTicketId}*/}
                                            {/*thisIdx={ticketIdx}*/}
                                            {/*size={this.props.patches.data.length}*/}
                                        {/*/>*/}
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12" xs="12" md="12">
                            <Container>
                                <Row>
                                    <Col>
                                        <h1>#id - patch name</h1>
                                    </Col>
                                </Row>
                                <Row className="pt-3">
                                    <Col>
                                        {/*<RestrictedView reqUser={patch.author} minRole={ROLE_PROGRAMMER}>*/}
                                            {/*<Link to={path+'/edit'} className="mr-3"><FontAwesomeIcon icon="edit"/>&nbsp;Edit</Link>*/}
                                        {/*</RestrictedView>*/}
                                    </Col>
                                </Row>
                                <Row className="pt-3 border-bottom">
                                    <Col className="mt-md-4 pb-3">
                                        <Detail />
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col lg="12" xs="12" md="12">
                            <Container className="mt-5">
                                <h4 className="mb-3">Fixing bugs:</h4>
                                <CardColumns>
                                    <BugCard/>
                                    <BugCard/>
                                    <BugCard/>
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
            patches: state.patches,
            username: state.global.user ? state.global.user.username : null
        }
    },
    dispatch => {
        return {
            getFilteredPatches: (filter) => dispatch(getFilteredPatches(filter))
        }
    }
)(withRouter(PatchInfo));

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
                        <Link to="/">author</Link>
                    </Row>
                    <Row className="no-margin">
                        <span className="text-muted">
                            Status:
                        </span>
                        &nbsp;
                        status
                    </Row>
                </Col>
                <Col md="6" xs="12">
                    <Row className="no-margin">
                        <span className="text-muted">
                            Created:
                        </span>
                        &nbsp;
                        datum
                    </Row>
                    <Row className="no-margin">
                        <span className="text-muted">
                            Released:
                        </span>
                        &nbsp;
                        datum
                    </Row>
                </Col>
            </Row>
        </>
    );
});

const BugCard = withRouter((props) => {
    return (
        <Card>
            <CardBody>
                <CardTitle>
                    Title
                    {/*<RestrictedView minRole={ROLE_SUPERVISOR}>*/}
                        {/*<Link to={props.match.path+'/edit/'+props.module.id}><FontAwesomeIcon icon="edit" className="float-right"/></Link>*/}
                    {/*</RestrictedView>*/}
                </CardTitle>
                <CardText className="border-bottom pb-3 text-justify">
                    Bug description
                </CardText>
                <div>
                    <span className="mr-2">Module:</span>
                    {/*{props.module.languages.map(item => <Badge color="primary" pill key={item} className="mr-1">{item}</Badge>)}*/}
                    {/*<ViewBugsBtn onClick={() => props.openModal(props.module)} />*/}
                </div>
                <div>
                    <span className="mr-2">Tickets:</span>
                    {/*<Link to={"/profile/view/"+props.module.expert}>{props.module.expert}</Link>*/}
                </div>
            </CardBody>
        </Card>
    );
});