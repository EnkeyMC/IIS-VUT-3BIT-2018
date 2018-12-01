import React from 'react';
import CardContainer from "./CardContainer";
import {CardBody, CardHeader, Container} from "reactstrap";
import {StateRenderer} from "../utils";
import {connect} from "react-redux";
import {getBug} from "../actions/bugs";
import BugForm from "./BugForm";

export default class BugEdit extends React.Component {
    componentDidMount() {
        this.props.getBug(this.props.match.params.id);
    }

    render() {
        return (
            <div className="ticket-info content-height">
                <Container>
                    <CardContainer>
                        <StateRenderer
                            state={this.props}
                            renderCondition={this.props.bug !== null}
                        >
                            {props => {return (<>
                                <CardHeader className="h4">
                                    Edit bug
                                </CardHeader>
                                <CardBody>
                                    <BugForm bug={props.bug} />
                                </CardBody>
                            </>)}}
                        </StateRenderer>
                    </CardContainer>
                </Container>
            </div>
        );
    }
}

BugEdit = connect(
    state => {
        return {
            bug: state.bugView.bugInfo.data,
            loading: state.bugView.bugInfo.loading,
            error: state.bugView.bugInfo.error
        }
    },
    dispatch => {
        return {
            getBug: (id) => dispatch(getBug(id))
        }
    }
)(BugEdit);