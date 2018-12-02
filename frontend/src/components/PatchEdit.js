import React from 'react';
import CardContainer from "./CardContainer";
import {CardBody, CardHeader, Container} from "reactstrap";
import {StateRenderer} from "../utils";
import {connect} from "react-redux";
import {getPatch} from "../actions/patches";
import PatchForm from "./PatchForm";

export default class PatchEdit extends React.Component {
    componentDidMount() {
        this.props.getPatch(this.props.match.params.id);
    }

    render() {
        return (
            <div className="info content-height">
                <Container>
                    <CardContainer>
                        <StateRenderer
                            state={this.props}
                            renderCondition={this.props.patch !== null}
                        >
                            {props => {return (<>
                                <CardHeader className="h4">
                                    Edit patch
                                </CardHeader>
                                <CardBody>
                                    <PatchForm patch={props.patch} />
                                </CardBody>
                            </>)}}
                        </StateRenderer>
                    </CardContainer>
                </Container>
            </div>
        );
    }
}

PatchEdit = connect(
    state => {
        return {
            patch: state.bugView.bugInfo.data,
            loading: state.bugView.bugInfo.loading,
            error: state.bugView.bugInfo.error
        }
    },
    dispatch => {
        return {
            getPatch: (id) => dispatch(getPatch(id))
        }
    }
)(PatchEdit);