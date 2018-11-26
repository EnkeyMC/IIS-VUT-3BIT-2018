import React from "react";
import {Form as BsForm, FormFeedback, FormGroup, FormText, Input as BsInput, Label} from 'reactstrap';
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
        this.setState = this.setState.bind(this);
        this.onMultiSelectChange = this.onMultiSelectChange.bind(this);
        this.setValue = this.setValue.bind(this);

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
        if (this.props.beforeSubmit) {
            const ret = this.props.beforeSubmit(this.state, event, this.setState);
            if (ret === false) {
                event.preventDefault();
                return false;
            }
        }

        var data = new FormData();
        const fields = this.state.fields;

        for (const name in fields) {
            if (fields.hasOwnProperty(name)) {
                if (Array.isArray(fields[name].value)) {
                    for (const i in fields[name].value) {
                        if (fields[name].value.hasOwnProperty(i))
                            data.append(name, fields[name].value[i]);
                    }
                } else {
                    data.append(name, fields[name].value);
                }
            }
        }

        this.props.onSubmit(this.props.id, this.props.url, data, this.props.edit)
            .then(action => {
                if (action.payload && this.props.onSubmitSuccess) {
                    this.props.onSubmitSuccess(this.props.id, action.payload.data);
                } else if (action.error && action.error.response.status === 400) {
                    var fields = {};

                    const data = action.error.response.data;
                    for (const name in this.state.fields) {
                        let parts = name.split('.');
                        let hasError = false;
                        let subObj = data;

                        for (let i = 0; i < parts.length; ++i) {
                            if (subObj.hasOwnProperty(parts[i])) {
                                subObj = subObj[parts[i]];
                            } else {
                                subObj = null;
                                break;
                            }
                        }

                        if (subObj !== null) {
                            hasError = true;
                            fields[name] = copyMerge(this.state.fields[name], {error: subObj});
                        }

                        if (this.state.fields.hasOwnProperty(name) && !hasError) {
                            fields[name] = copyMerge(this.state.fields[name], {error: null});
                        }
                    }

                    this.setState({
                        fields: copyMerge(this.state.fields, fields)
                    });

                    if (data.non_field_errors) {
                        data.non_field_errors.forEach(item => this.props.alert.error(item));
                    }
                } else if (action.error) {
                    this.props.alert.error(action.error.message);
                }
            });

        event.preventDefault();
    }

    onChange(event) {
        const name = event.target.name;
        const target = event.target;

        event.persist();
        this.setState(state => { return {
            fields: copyMerge(state.fields, {
                [name]: copyMerge(
                    state.fields[name],
                    {value: target.type === 'checkbox' ? target.checked : target.value}
                )
            })
        }});
    }

    onMultiSelectChange(event) {
        const options = event.target.options;
        const name = event.target.name;
        let value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }

        event.persist();
        this.setState(state => { return {
            fields: copyMerge(state.fields, {
                [name]: copyMerge(
                    state.fields[name],
                    {value: value}
                )
            })
        }});
    }

    setValue(name, value) {
        this.setState(state => {
            return {
                fields: copyMerge(state.fields, {
                    [name]: copyMerge(
                        state.fields[name],
                        {value: value}
                    )
                })
            }
        });
    }

    registerInput(name, defaultValue) {
        if (this._isMounted) {
            this.setState((state) => {
                return {
                    fields: copyMerge(state.fields, {[name]: {value: defaultValue}})
                }
            });
        } else {
            this._fieldsToRegister = this._fieldsToRegister.concat([{name: name, defaultValue: defaultValue}]);
        }
    }

    render () {
        return (
            <BsForm onSubmit={this.onSubmit} className={this.props.className}>
                <FormContext.Provider value={{
                    onChange: this.onChange,
                    registerInput: this.registerInput,
                    state: this.state,
                    onMultiSelectChange: this.onMultiSelectChange,
                    setValue: this.setValue}}
                >
                    {this.props.children}
                </FormContext.Provider>
            </BsForm>
        );
    }
}

export const withForm = WrappedComponent => {
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
    null,
    dispatch => {
        return {
            onSubmit: (id, url, data, edit) => dispatch(submitForm(id, url, data, edit))
        }
    }
)(withAlert(Form));



export class Input extends React.Component {
    componentDidMount() {
        this.props.form.registerInput(this.props.name, this.props.defaultValue ? this.props.defaultValue : "");
        if (this.props.onMount)
            this.props.onMount(this.props);
    }

    render() {
        const {label: labelProps, formGroup: formGroupProps, hint, form, required, defaultValue, ...inputProps} = this.props;
        if (!form.state.fields[this.props.name])
            return null;

        const error = form.state.fields[this.props.name].error;

        return (
            <FormGroup {...formGroupProps}>
                {
                    labelProps ?
                        <Label
                            {...labelProps}
                            for={this.props.id}>
                            {labelProps.text}{required ? <span className="text-danger">&nbsp;*</span> : null}
                        </Label>
                        :
                        null
                }
                <BsInput
                    {...(error ? {invalid: true} : {})}
                    onChange={form.onChange}
                    value={form.state.fields[this.props.name].value}
                    {...inputProps}
                />
                <FormFeedback>{error}</FormFeedback>
                { hint ? <FormText>{hint}</FormText> : null }
            </FormGroup>
        );
    }
}

Input = withForm(Input);

export class Select extends React.Component {
    componentDidMount() {
        const def = this.props.multiple ? [] : "";
        this.props.form.registerInput(this.props.name, this.props.defaultValue ? this.props.defaultValue : def);
        if (this.props.onMount)
            this.props.onMount(this.props);
    }

    render() {
        const {label: labelProps, formGroup: formGroupProps, hint, form, required, defaultValue, ...inputProps} = this.props;
        if (!form.state.fields[this.props.name])
            return null;

        const error = form.state.fields[this.props.name].error;

        return (
            <FormGroup {...formGroupProps}>
                {
                    labelProps ?
                        <Label
                            {...labelProps}
                            for={this.props.id}>
                            {labelProps.text}{required ? <span className="text-danger">&nbsp;*</span> : null}
                        </Label>
                        :
                        null
                }
                <BsInput
                    type="select"
                    {...(error ? {invalid: true} : {})}
                    onChange={inputProps.multiple ? form.onMultiSelectChange : form.onChange}
                    value={form.state.fields[this.props.name].value}
                    {...inputProps}
                >
                    {(typeof this.props.children === 'function') ? this.props.children() : this.props.children}
                </BsInput>
                <FormFeedback>{error}</FormFeedback>
                { hint ? <FormText>{hint}</FormText> : null }
            </FormGroup>
        );
    }
}

Select = withForm(Select);

export class Checkbox extends React.Component {
    componentDidMount() {
        this.props.form.registerInput(this.props.name, this.props.defaultValue ? this.props.defaultValue : false);
        if (this.props.onMount)
            this.props.onMount(this.props);
    }

    render() {
        const {label: labelProps, formGroup: formGroupProps, hint, form, required, defaultValue, ...inputProps} = this.props;
        if (!form.state.fields[this.props.name])
            return null;

        const error = form.state.fields[this.props.name].error;

        return (
            <FormGroup check {...formGroupProps} className="mb-2">
                {
                    labelProps ?
                        <Label
                            check
                            {...labelProps}
                            for={this.props.id}
                        >
                            <BsInput
                                type="checkbox"
                                {...(error ? {invalid: true} : {})}
                                onChange={form.onChange}
                                checked={form.state.fields[this.props.name].value}
                                {...inputProps}
                            />
                            {' '}{labelProps.text}{required ? <span className="text-danger">&nbsp;*</span> : null}
                        </Label>
                        :
                        null
                }
                <FormFeedback>{error}</FormFeedback>
                { hint ? <FormText>{hint}</FormText> : null }
            </FormGroup>
        );
    }
}

Checkbox = withForm(Checkbox);