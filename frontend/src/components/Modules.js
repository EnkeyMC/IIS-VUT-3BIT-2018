import React, {Component} from 'react';
import { Card, CardTitle, CardText, CardColumns,
    Container, CardBody, Badge, Button, UncontrolledTooltip } from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {getModules} from "../actions";
import {StateRenderer} from "../utils";
import {withRouter} from "react-router";

export default class Modules extends Component {
    componentDidMount() {
        this.props.getModules();
    }

    render() {
        return (
            <StateRenderer state={this.props} renderCondition={this.props.modules !== null}>
                {props => {
                    return  (<>
                        <Container className="mt-5">
                            <h1 className="mb-3">Modules</h1>
                            <CardColumns>
                                {
                                    props.modules.map(module => <ModuleCard module={module} key={module.id}/>)
                                }
                                <NewModuleBtn/>
                            </CardColumns>
                        </Container>
                    </>);
                }}
            </StateRenderer>
        );
    }
}

function ModuleCard(props) {
    console.log(props);
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
                </div>
                <div>
                    <span className="mr-2">Expert:</span>
                    {props.module.expert}
                </div>
            </CardBody>
        </Card>
    );
}

const NewModuleBtn = withRouter((props) => {
    return (
        <Card className="new-module pointer">
            <CardBody className="flex-mid">
                <FontAwesomeIcon icon="plus" size="4x" color="rgba(0, 0, 0, 0.1)" className="mt-4 mb-4"/>
            </CardBody>
        </Card>
    );
});

Modules = connect (
    state => {
        return {
            modules: state.modules.data,
            loading:  state.modules.loading,
            error: state.modules.error
        }
    },
    dispatch => {
        return {
            getModules: () => dispatch(getModules())
        }
    }
) (Modules);