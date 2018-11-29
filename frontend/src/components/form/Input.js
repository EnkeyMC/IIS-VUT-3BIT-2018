import React from "react";
import {FormGroup, Label, Input as BsInput, FormFeedback, FormText} from "reactstrap";
import {withForm} from "./Form";
import PropTypes from "prop-types";


export class Input extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.form.onChange(this.props.name, event.target.value);
    }

    componentDidMount() {
        this.props.form.registerInput(this.props.name, this.props.defaultValue ? this.props.defaultValue : "");
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
                    {...(error ? {invalid: true} : {})}
                    onChange={this.handleChange}
                    value={form.state.fields[this.props.name].value}
                    {...inputProps}
                />
                <FormFeedback>{error}</FormFeedback>
                {hint ? <FormText>{hint}</FormText> : null}
            </FormGroup>
        );
    }
}

Input.propTypes = {
    label: PropTypes.string,
    hint: PropTypes.string,
    form: PropTypes.object.isRequired,
    required: PropTypes.bool,
    onMount: PropTypes.func,
    defaultValue: PropTypes.any,
    id: PropTypes.string,
    name: PropTypes.string
};

Input = withForm(Input);