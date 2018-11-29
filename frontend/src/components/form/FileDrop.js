import React from "react";
import {FormGroup, Label, FormFeedback, FormText} from "reactstrap";
import Dropzone from "react-dropzone";
import {withForm} from "./Form";
import PropTypes from 'prop-types';
import {withAlert} from "react-alert";

export class FileDrop extends React.Component {
    constructor(props) {
        super(props);

        this.onDrop = this.onDrop.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }


    componentDidMount() {
        this.props.form.registerInput(this.props.name, null);
        if (this.props.onMount)
            this.props.onMount(this.props);
    }

    onDrop(acceptedFiles, rejectedFiles) {
        if (rejectedFiles.length !== 0) {
            this.props.alert.error("Invalid file type or file is larger than 1 MB");
        } else if (acceptedFiles.length === 1) {
            this.props.form.onChange(this.props.name, acceptedFiles[0]);
        }
    }

    onCancel() {
        this.props.form.registerInput(this.props.name, null);
    }

    render() {
        const {label, hint, form, required, accept, ...inputProps} = this.props;
        const field = form.state.fields[this.props.name];
        if (!field)
            return null;

        const error = field.error;

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
                <Dropzone
                    accept={accept}
                    onDrop={this.onDrop}
                    onFileDialogCancel={this.onCancel}
                    maxSize={1024*1024}
                    multiple={false}
                    {...inputProps}
                >
                    {
                        field.value ?
                            <p>{field.value.name}</p>
                            :
                            <p>Upload file by dragging & dropping or click here.</p>
                    }
                </Dropzone>
                <FormFeedback>{error}</FormFeedback>
                {hint ? <FormText>{hint}</FormText> : null}
            </FormGroup>
        );
    }
}

FileDrop.propTypes = {
    label: PropTypes.string,
    hint: PropTypes.string,
    form: PropTypes.object.isRequired,
    required: PropTypes.bool,
    accept: PropTypes.string,
    onMount: PropTypes.func,
    id: PropTypes.string,
    name: PropTypes.string
};

FileDrop = withForm(withAlert(FileDrop));