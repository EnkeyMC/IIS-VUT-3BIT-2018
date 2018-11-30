import React from "react";
import {FormGroup, Label, Input as BsInput, FormFeedback, FormText} from "reactstrap";
import {withForm} from "./Form";
import PropTypes from "prop-types";

export class Checkbox extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.form.onChange(this.props.name, event.target.checked)
    }

    componentDidMount() {
        this.props.form.registerInput(this.props.name, this.props.defaultValue ? this.props.defaultValue : false);
        if (this.props.onMount)
            this.props.onMount(this.props);
    }

    render() {
        const {label, hint, form, required, defaultValue, ...inputProps} = this.props;
        if (!form.state.fields[this.props.name])
            return null;

        const error = form.state.fields[this.props.name].error;

        return (
            <FormGroup check className="mb-2">
                <Label check for={this.props.id}>
                    <BsInput
                        type="checkbox"
                        {...(error ? {invalid: true} : {})}
                        onChange={this.handleChange}
                        checked={form.state.fields[this.props.name].value}
                        {...inputProps}
                    />
                    {' '}{label}{required ? <span className="text-danger">&nbsp;*</span> : null}
                </Label>
                <FormFeedback>{error}</FormFeedback>
                {hint ? <FormText>{hint}</FormText> : null}
            </FormGroup>
        );
    }
}


Checkbox.propTypes = {
    label: PropTypes.string,
    hint: PropTypes.string,
    required: PropTypes.bool,
    onMount: PropTypes.func,
    defaultValue: PropTypes.any,
    id: PropTypes.string
};

Checkbox = withForm(Checkbox);