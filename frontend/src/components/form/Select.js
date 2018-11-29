import React from "react";
import {FormGroup, Label, Input as BsInput, FormFeedback, FormText} from "reactstrap";
import {withForm} from "./Form";
import PropTypes from "prop-types";

export class Select extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        if (this.props.multiple)
            this.props.form.onChange(this.props.name, event.target.value);
        else {
            const options = event.target.options;
            let value = [];
            for (let i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    value.push(options[i].value);
                }
            }
            this.props.form.onChange(this.props.name, value);
        }
    }

    componentDidMount() {
        const def = this.props.multiple ? [] : "";
        this.props.form.registerInput(this.props.name, this.props.defaultValue ? this.props.defaultValue : def);
        if (this.props.onMount)
            this.props.onMount(this.props);
    }

    render() {
        const {label, hint, form, required, defaultValue, ...inputProps} = this.props;
        if (!form.state.fields[this.props.name])
            return null;

        const error = form.state.fields[this.props.name].error;

        return (
            <FormGroup>
                {
                    label ?
                        <Label
                            for={this.props.id}>
                            {label}{required ? <span className="text-danger">&nbsp;*</span> : null}
                        </Label>
                        :
                        null
                }
                <BsInput
                    type="select"
                    {...(error ? {invalid: true} : {})}
                    onChange={this.handleChange}
                    value={form.state.fields[this.props.name].value}
                    {...inputProps}
                >
                    {(typeof this.props.children === 'function') ? this.props.children() : this.props.children}
                </BsInput>
                <FormFeedback>{error}</FormFeedback>
                {hint ? <FormText>{hint}</FormText> : null}
            </FormGroup>
        );
    }
}

Select.propTypes = {
    label: PropTypes.string,
    hint: PropTypes.string,
    form: PropTypes.object.isRequired,
    required: PropTypes.bool,
    accept: PropTypes.string,
    onMount: PropTypes.func,
    defaultValue: PropTypes.any,
    id: PropTypes.string,
    name: PropTypes.string
};

Select = withForm(Select);