import React from 'react';
import {Card, FormFeedback, FormGroup, FormText, Input as BsInput, InputGroupText, Label} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {withForm} from "./Form";
import PropTypes from "prop-types";

const Context = React.createContext();

export default class MultiSearchSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: ""
        };

        this.onSearchChange = this.onSearchChange.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
    }

    componentDidMount() {
        this.props.form.registerInput(this.props.name, this.props.defaultValue ? this.props.defaultValue : []);
        if (this.props.onMount)
            this.props.onMount(this.props);
    }

    onSearchChange(event) {
        this.setState({
            search: event.target.value
        });
    }

    onItemClick(value) {
        let values = this.props.form.state.fields[this.props.name].value;
        if (values.find(val => val === value)) {
            values = values.filter(val => val !== value);
        } else {
            values = values.concat([value]);
        }
        this.props.form.onChange(this.props.name, values);
    }

    render() {
        const {label, hint, form, required} = this.props;

        if (!form.state.fields[this.props.name])
            return null;

        const error = form.state.fields[this.props.name].error;

        return (
            <FormGroup>
            {
                label ?
                    <Label for={this.props.id}>
                        {label}{required ? <span className="text-danger">&nbsp;*</span> : null}
                    </Label>
                    :
                    null
            }
                <div className={"form-control multi-search-select "+(error ? 'is-invalid' : '')}>
                    <div className="multi-search-select-header">
                        <InputGroupText>
                            <FontAwesomeIcon icon="search" />
                        </InputGroupText>
                        <BsInput name="search" value={this.state.search} placeholder="Type to search" onChange={this.onSearchChange} />
                    </div>
                    <div className="y-scroll select-items">
                        <Context.Provider value={{
                            search: this.state.search,
                            onItemClick: this.onItemClick,
                            values: form.state.fields[this.props.name].value
                        }}>
                            {this.props.children()}
                        </Context.Provider>
                    </div>
                </div>
                <FormFeedback>{error}</FormFeedback>
                { hint ? <FormText>{hint}</FormText> : null }
            </FormGroup>
        );
    }
}

MultiSearchSelect.propTypes = {
    label: PropTypes.string,
    hint: PropTypes.string,
    required: PropTypes.bool,
    onMount: PropTypes.func,
    defaultValue: PropTypes.any,
    id: PropTypes.string,
    name: PropTypes.string
};

MultiSearchSelect = withForm(MultiSearchSelect);

export function MultiSelectItem(props) {
    return (
        <Context.Consumer>
            {select => {
                if (!props.label.toLowerCase().includes(select.search.toLowerCase()))
                    return null;

                let label = props.label;
                if (select.search) {
                    const idx = props.label.toLowerCase().indexOf(select.search.toLowerCase());
                    label = props.label.substring(0, idx) + '<span class=highlight>'
                        + props.label.substring(idx, idx + select.search.length)
                        + '</span>' + props.label.substring(idx + select.search.length);
                }

                const checked = select.values.find(val => val === props.value);
                return (
                    <Card
                        className={"select-item " + (checked ? "checked" : "unchecked")}
                        onClick={() => select.onItemClick(props.value)}
                    >
                        <div className="d-block">
                        <span className="mr-2 check">
                            <FontAwesomeIcon
                                icon={{prefix: 'far', iconName: checked ? "check-square" : "square"}}
                                fixedWidth
                            />
                        </span>
                            {
                                props.children ?
                                    <span className="label">
                                        {props.children(<span dangerouslySetInnerHTML={{__html: label}} />)}
                                    </span>
                                    :
                                    <span dangerouslySetInnerHTML={{__html: label}} />
                            }
                        </div>
                    </Card>
                )
            }}
        </Context.Consumer>
    );
}

MultiSelectItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired
};
