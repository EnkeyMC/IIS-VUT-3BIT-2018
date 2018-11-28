import React, {Component} from 'react';
import { Card, CardTitle, CardText, CardColumns,
    Container, CardBody, Badge, Button, ModalHeader,
    ModalBody, Modal } from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {getModules, getModuleBug, clearModuleBugs, GET_MODULE_BUG, cancelActionRequests} from "../actions";
import {Spinner, StateRenderer} from "../utils";
import {withRouter} from "react-router";
import Error from "./Error";

export default class Modules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            assignBugsModalOpen: false
        };

        this.toggleAssignBugsModal = this.toggleAssignBugsModal.bind(this);
        this.closeAssignBugsModal = this.closeAssignBugsModal.bind(this);
    }

    toggleAssignBugsModal() {
        this.setState({
            assignBugsModalOpen: !this.state.assignBugsModalOpen
        });
    }

    closeAssignBugsModal() {
        this.setState({
            assignBugsModalOpen: false
        });
    }

    componentDidMount() {
        this.props.getModules();
    }

    render() {
        return (
            <StateRenderer state={this.props} renderCondition={this.props.modules !== null}
            renderLoading={() =>
                <div className="content-height flex-mid">
                    <Spinner size="5x" />
                </div>
            }
            >
                {props => {
                    return  (<>
                        <Container className="mt-5">
                            <h1 className="mb-3">Modules</h1>
                            <CardColumns>
                                {
                                    props.modules.map(module => <ModuleCard toggleModal={this.toggleAssignBugsModal}
                                                                            module={module}
                                                                            key={module.id}
                                    />)
                                }
                                <NewModuleBtn/>
                            </CardColumns>
                        </Container>
                        <Modal isOpen={this.state.assignBugsModalOpen}
                               toggle={this.toggleAssignBugsModal}
                               className={this.props.className} centered>
                            <ModalHeader toggle={this.toggleAssignTicketsModal}>Related bugs</ModalHeader>
                            <ModalBody>
                                <BugsContainer/>
                            </ModalBody>
                        </Modal>
                    </>);
                }}
            </StateRenderer>
        );
    }
}

Modules = connect (
    state => {
        return {
            modules: state.modules.data,
            loading: state.modules.loading,
            error: state.modules.error
        }
    },
    dispatch => {
        return {
            getModules: () => dispatch(getModules()),
            getModuleBug: (id) => dispatch(getModuleBug(id)),
            clearModuleBugs: () => dispatch(clearModuleBugs()),
            cancelActions: (actionType) => dispatch(cancelActionRequests(actionType))
        }
    }
) (Modules);

function ModuleCard(props) {
    return (
        <Card>
            <CardBody>
                <CardTitle>
                    {props.module.name}
                    <Link to="/"><FontAwesomeIcon icon="edit" className="float-right"/></Link>
                </CardTitle>
                <CardText className="border-bottom pb-3">
                    {props.module.description}
                </CardText>
                <div>
                    <span className="mr-2">Languages:</span>
                    {props.module.languages.map(item => <Badge color="primary" pill key={item} className="mr-1">{item}</Badge>)}
                    <ViewBugsBtn onClick={props.toggleModal} />
                </div>
                <div>
                    <span className="mr-2">Expert:</span>
                    {props.module.expert}
                </div>
            </CardBody>
        </Card>
    );
}

function ViewBugsBtn(props) {
    return (
        <Button className="float-right module-bugs" outline color="danger" onClick={props.onClick}>Bugs</Button>
    );
}

class BugsContainer extends Component {

    componentDidMount() {
        this.props.getModuleBug();
    }

    requestBugs() {
        this.props.cancelActions(GET_MODULE_BUG);
        this.props.clearModuleBugs();
        this.props.moduleBugs(id => this.props.getModuleBug(id));
    }

    render() {
        if (this.props.error) {
            return this.props.error.map((err, idx) => {
                return (
                    <div className="flex-mid mt-3 mb-3" key={idx}>
                        <Error>
                            {err}
                        </Error>
                    </div>
                );
            });
        }

        return (
            <div>
                {this.props.data.map(bug => <Bug bug={bug} key={bug.id} />)}
                {
                    this.props.loading ?
                        <div className="flex-mid mt-4">
                            <Spinner size="2x" />
                        </div>
                        :
                        null
                }
            </div>
        );
    }
}

BugsContainer = connect(
    state => {
        return {
            loading: state.modules.moduleBugs.loading !== 0,
            error: state.modules.moduleBugs.error,
            data: state.modules.moduleBugs.data
        }
    }
)(BugsContainer);

function Bug(props) {
    return (
        <div>dfs</div>
    );
}

const NewModuleBtn = withRouter((props) => {
    return (
        <Card className="card-new-btn pointer">
            <CardBody className="flex-mid">
                <FontAwesomeIcon icon="plus" size="4x" color="rgba(0, 0, 0, 0.1)" className="mt-4 mb-4"/>
            </CardBody>
        </Card>
    );
});