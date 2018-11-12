import React from "react";
import {Form as BsForm, FormFeedback, FormGroup, Input as BsInput, Label} from 'reactstrap';
import {connect} from "react-redux";
import {submitForm} from "../actions";
import {copyMerge} from "../utils";
import {withAlert} from "react-alert";

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
        var data = new FormData();

        for (const name in this.state.fields) {
            if (this.state.fields.hasOwnProperty(name)) {
                data.append(name, this.state.fields[name].value);
            }
        }

        this.props.onSubmit(this.props.id, this.props.url, data)
            .then(action => {
                if (action.payload && this.props.onSubmitSuccess) {
                    this.props.onSubmitSuccess(this.props.id, action.payload.data);
                } else if (action.error && action.error.response.status === 400) {
                    var fields = {};

                    const data = action.error.response.data;
                    for (const name in this.state.fields) {
                        if (data.hasOwnProperty(name)) {
                            fields[name] = copyMerge(this.state.fields[name], {error: data[name]});
                        } else if (this.state.fields.hasOwnProperty(name)) {
                            fields[name] = copyMerge(this.state.fields[name], {error: null});
                        }
                    }

                    this.setState({
                        fields: copyMerge(this.state.fields, fields)
                    });

                    if (data.non_field_errors) {
                        data.non_field_errors.forEach(item => this.props.alert.error(item));
                    }
                }
            });

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
        return {storeState: state.forms[ownProps.id]}
    },
    dispatch => {
        return {
            onSubmit: (id, url, data) => dispatch(submitForm(id, url, data))
        }
    }
)(withAlert(Form));

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
        const {label: labelProps, formGroup: formGroupProps, form, ...inputProps} = this.props;
        if (!form.state.fields[this.props.name])
            return null;

        const error = form.state.fields[this.props.name].error;

        return (
            <FormGroup {...formGroupProps}>
                {labelProps ? <Label {...labelProps} for={this.props.id}>{labelProps.text}</Label> : null }
                <BsInput
                    {...(error ? {invalid: true} : {})}
                    onChange={form.onChange}
                    value={form.state.fields[this.props.name].value}
                    {...inputProps}
                />
                <FormFeedback>{error}</FormFeedback>
            </FormGroup>
        );
    }
}

Input = withForm(Input);