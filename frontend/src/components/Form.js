import React from "react";
import { Form as BsForm, Input as BsInput } from 'reactstrap';
import {connect} from "react-redux";
import {submitForm} from "../actions";
import {copyMerge} from "../utils";

const FormContext = React.createContext();

export class Form extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.registerInput = this.registerInput.bind(this);

        this.state = {
            fields: {}
        };

        this._isMounted = false;
        this._fieldsToRegister = [];
    }

    componentDidMount() {
        this._isMounted = true;

        let newFields = {};
        for (const field in this._fieldsToRegister) {
            newFields[this._fieldsToRegister[field].name] = {
                value: this._fieldsToRegister[field].defaultValue
            }
        }

        this.setState({
            fields: copyMerge(
                this.state.fields,
                newFields
            )
        });
    }

    onSubmit(event) {
        //this.props.onSubmit(this.props.id, event);

        event.preventDefault();
    }

    onChange(event) {
        const name = event.target.name;
        this.setState({
            fields: copyMerge(this.state.fields, {
                [name]: copyMerge(
                    this.state.fields[name],
                    {value: event.target.value}
                )
            })
        });
    }

    registerInput(name, defaultValue) {
        if (this._isMounted) {
            this.setState({
                fields: copyMerge(this.state.fields, {[name]: {value: defaultValue}})
            });
        } else {
            this._fieldsToRegister = this._fieldsToRegister.concat([{name: name, defaultValue: defaultValue}]);
        }
    }

    render () {
        return (
            <BsForm onSubmit={this.onSubmit}>
                <FormContext.Provider value={{onChange: this.onChange, registerInput: this.registerInput, state: this.state}}>
                    {this.props.children}
                </FormContext.Provider>
            </BsForm>
        );
    }
}

const withForm = WrappedComponent => {
    class withForm extends React.Component {
        render() {
            return (
                <FormContext.Consumer>
                    {context => <WrappedComponent {...this.props} form={context} />}
                </FormContext.Consumer>
            );
        }
    }
    return withForm;
};

Form = connect(
    (state, ownProps) => {
        return {}
    },
    dispatch => {
        return {
            onSubmit: () => dispatch(submitForm())
        }
    }
)(Form);

export class Input extends React.Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.props.form.registerInput(this.props.name, this.props.defaultValue ? this.props.defaultValue : "");
        if (this.props.onMount)
            this.props.onMount(this.props);
    }

    render() {
        return (
                <BsInput
                    {...this.props}
                    onChange={this.props.form.onChange}
                    value={this.props.form.state[this.props.name]}
                />
        );
    }
}

Input = withForm(Input);