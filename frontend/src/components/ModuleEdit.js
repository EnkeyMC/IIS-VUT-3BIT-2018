import React from 'react';
import CardContainer from "./CardContainer";
import {CardBody, CardHeader} from "reactstrap";
import ModuleForm from "./ModuleForm";
import {StateRenderer} from "../utils";
import {connect} from "react-redux";
import {getModule} from "../actions/modules";

export default class ModuleEdit extends React.Component {
    componentDidMount() {
        this.props.getModule(this.props.match.params.id);
    }

    render() {
        return (
            <CardContainer>
                <StateRenderer
                    state={this.props}
                    renderCondition={this.props.module !== null}
                >
                    {props => {return (<>
                        <CardHeader className="h4">
                            Edit module
                        </CardHeader>
                        <CardBody>
                            <ModuleForm module={props.module} />
                        </CardBody>
                    </>)}}
                </StateRenderer>
            </CardContainer>
        );
    }
}

ModuleEdit = connect(
    state => {
        return {
            module: state.module.data,
            loading: state.module.loading,
            error: state.module.error
        }
    },
    dispatch => {
        return {
            getModule: (id) => dispatch(getModule(id))
        }
    }
)(ModuleEdit);