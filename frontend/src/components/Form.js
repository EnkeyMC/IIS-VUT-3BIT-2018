import React from "react";
import { Form as BsForm, Input as BsInput } from 'reactstrap';
import {connect} from "react-redux";
import {handleChange, submitForm} from "../actions";

const FormContext = React.createContext();

export class Form extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(event) {
        //this.props.onSubmit(this.props.id, event);

        event.preventDefault();
    }

    onChange(event) {
        if (event)
            this.props.onChange(this.props.id, event);
    }

    render () {
        return (
            <BsForm onSubmit={this.onSubmit}>
                <FormContext.Provider value={{onChange: this.onChange, id: this.props.id, form: this.props.form}}>
                    {this.props.children}
                </FormContext.Provider>
            </BsForm>
        );
    }
}

Form = connect(
    (state, ownProps) => {
        return { form: state.forms[ownProps.id] }
    },
    dispatch => {
        return {
            onSubmit: () => dispatch(submitForm()),
            onChange: (id, event) => dispatch(handleChange(id, event))
        }
    }
)(Form);

export class Input extends React.Component {
    render() {
        return (
            <FormContext.Consumer>
                {context => <BsInput
                    {...this.props}
                    onChange={context.onChange}
                    value={context.form ? context.form.fields[this.props.name] : ""}
                /> }
            </FormContext.Consumer>
        );
    }
}