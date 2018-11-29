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
import {Bug} from "./TicketInfo";
import {RestrictedView, ROLE_SUPERVISOR} from "./RoleRestriction";

export default class Modules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            moduleBugsModalOpen: false,
            moduleInModal: null
        };

        this.toggleModuleBugsModal = this.toggleModuleBugsModal.bind(this);
        this.closeModuleBugsModal = this.closeModuleBugsModal.bind(this);
        this.openModuleBugsModal = this.openModuleBugsModal.bind(this);
    }

    toggleModuleBugsModal() {
        this.setState({
            moduleBugsModalOpen: !this.state.moduleBugsModalOpen
        });
    }

    openModuleBugsModal(module) {
        this.setState({
            moduleBugsModalOpen: true,
            moduleInModal: module
        })
    }

    closeModuleBugsModal() {
        this.setState({
            moduleBugsModalOpen: false
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
                                    props.modules.map(module => <ModuleCard openModal={this.openModuleBugsModal}
                                                                            module={module}
                                                                            key={module.id}
                                    />)
                                }
                                <RestrictedView minRole={ROLE_SUPERVISOR}>
                                    <NewModuleBtn/>
                                </RestrictedView>
                            </CardColumns>
                        </Container>
                        <Modal isOpen={this.state.moduleBugsModalOpen}
                               toggle={this.toggleModuleBugsModal}
                               className={this.props.className} >
                            <ModalHeader toggle={this.toggleModuleBugsModal}>Bugs in module</ModalHeader>
                            <ModalBody>
                                <BugsContainer module={this.state.moduleInModal}/>
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
            getModules: () => dispatch(getModules())
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
                    <ViewBugsBtn onClick={() => props.openModal(props.module)} />
                </div>
                <div>
                    <span className="mr-2">Expert:</span>
                    <Link to={"/profile/view/"+props.module.expert}>{props.module.expert}</Link>
                </div>
            </CardBody>
        </Card>
    );
}

function ViewBugsBtn(props) {
    return (
        <Button className="float-right module-bugs" outline onClick={props.onClick}>Bugs</Button>
    );
}

class BugsContainer extends Component {
    componentDidMount() {console.log("mounted");
        if (this.props.module !== null)
            this.requestBugs();
    }

    requestBugs() {
        this.props.cancelActions(GET_MODULE_BUG);
        this.props.clearModuleBugs();
        this.props.module.bugs.forEach(id => this.props.getModuleBug(id));
    }

    render() {
        if (this.props.module === null) {
            return null;
        }

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
                {this.props.data.map(bug => <Bug bug={bug} key={bug.id} noRemove />)}
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
    },
    dispatch => {
        return {
            getModuleBug: (id) => dispatch(getModuleBug(id)),
            clearModuleBugs: () => dispatch(clearModuleBugs()),
            cancelActions: (actionType) => dispatch(cancelActionRequests(actionType))
        }
    }
)(BugsContainer);

const NewModuleBtn = withRouter((props) => {
    return (
        <Card className="card-new-btn pointer">
            <CardBody className="flex-mid">
                <FontAwesomeIcon icon="plus" size="4x" color="rgba(0, 0, 0, 0.1)" className="mt-4 mb-4"/>
            </CardBody>
        </Card>
    );
});