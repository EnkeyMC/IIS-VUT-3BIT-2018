import React from 'react';
import CardContainer from "./CardContainer";
import {CardBody, CardHeader, Container} from "reactstrap";
import {StateRenderer} from "../utils";
import {connect} from "react-redux";
import {getPatch} from "../actions/patches";
import PatchForm from "./PatchForm";
import {RestrictedRoute, ROLE_SUPERVISOR} from "./RoleRestriction";

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
                                    <RestrictedRoute minRole={ROLE_SUPERVISOR} reqUser={props.patch.author}>
                                        <PatchForm patch={props.patch} />
                                    </RestrictedRoute>
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
            patch: state.patch.data,
            loading: state.patch.loading,
            error: state.patch.error
        }
    },
    dispatch => {
        return {
            getPatch: (id) => dispatch(getPatch(id))
        }
    }
)(PatchEdit);