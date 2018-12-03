import React from "react";
import {Form as BsForm} from 'reactstrap';
import {connect} from "react-redux";
import {submitForm} from "../../actions";
import {copyMerge} from "../../utils";
import {withAlert} from "react-alert";
import PropTypes from "prop-types";

const FormContext = React.createContext();

export class Form extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setState = this.setState.bind(this);
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
                    if (fields[name].value.length === 0) {
                        data.append(name, "");
                    } else {
                        for (const i in fields[name].value) {
                            if (fields[name].value.hasOwnProperty(i))
                                data.append(name, fields[name].value[i]);
                        }
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
                    if (action.error.response && action.error.response.data.detail)
                        this.props.alert.error(action.error.response.data.detail);
                    else
                        this.props.alert.error(action.error.message);
                }
            });

        event.preventDefault();
    }

    onChange(name, newValue) {
        this.setState(state => { return {
            fields: copyMerge(state.fields, {
                [name]: copyMerge(
                    state.fields[name],
                    {value: newValue}
                )
            })
        }});
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
                <FormContext.Provider
                    value={{
                        onChange: this.onChange,
                        registerInput: this.registerInput,
                        state: this.state
                    }}
                >
                    {this.props.children}
                </FormContext.Provider>
            </BsForm>
        );
    }
}

Form.propTypes = {
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    onSubmitSuccess: PropTypes.func,
    beforeSubmit: PropTypes.func,
    className: PropTypes.string
};

export const withForm = WrappedComponent => {
    class withFormCls extends React.Component {
        render() {
            return (
                <FormContext.Consumer>
                    {context => <WrappedComponent {...this.props} form={context} />}
                </FormContext.Consumer>
            );
        }
    }
    return withFormCls;
};

Form = connect(
    null,
    dispatch => {
        return {
            onSubmit: (id, url, data, edit) => dispatch(submitForm(id, url, data, edit))
        }
    }
)(withAlert(Form));

export const RequiredFieldsNotice = () => <p className="text-muted">Fields marked by <span className="text-danger">*</span> are required.</p>;
