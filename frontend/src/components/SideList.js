import React from 'react';
import {StateRenderer} from "../utils";
import {Link, NavLink} from "react-router-dom";
import {
    Button,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input,
    Label,
    UncontrolledDropdown,
    UncontrolledTooltip
} from "reactstrap";
import {withRouter} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function SideList (props) {
    const ItemComponent = props.itemTag;
    const itemIdName = props.itemIdName ? props.itemIdName : 'id';
    return (
        <div className="ticket-list content-height position-fixed">
            {props.children}
            <div className="list-group">
                <StateRenderer state={props.list} renderCondition={props.list.data !== null}>
                    {list => { return (
                        list.data.length === 0 ?
                            <div className="flex-mid mt-3 mb-3">
                                {list.noItems}
                            </div>
                            :
                            list.data.map(item => {
                                return <ItemComponent key={item[itemIdName]} item={item} />;
                            })
                    )}}
                </StateRenderer>
            </div>
        </div>
    )
}

export function SideListHeader(props) {
    return (
        <div className="w-100 p-2 select">
            <div>
                <h3 className="d-inline-block">{props.title}</h3>
                {props.newBtn ? props.newBtn : null}
            </div>
            {props.filter ? props.filter : null}
            {props.order ? props.order : null}
        </div>
    );
}

const FilterContext = React.createContext();

const withFilter = WrappedComponent => {
    class withFilter extends React.Component {
        render() {
            return (
                <FilterContext.Consumer>
                    {context => <WrappedComponent {...this.props} filter={context} />}
                </FilterContext.Consumer>
            );
        }
    }
    return withFilter;
};

export class SideListFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value.value ? props.value : props.defaultValue,
        };

        this.handleChange = this.handleChange.bind(this);
    }



    handleChange(value) {
        this.setState({value: value})
    }

    getLabel() {
        if (this.state.value.label)
            return this.state.value.label;
        return this.state.value.value;
    }

    render() {
        return (
            <UncontrolledDropdown setActiveFromChild className="d-inline">
                <DropdownToggle tag="a" className="nav-link pointer d-inline pl-0" caret>
                    <span className="text-muted">Filter:</span> {this.getLabel()}
                </DropdownToggle>
                <DropdownMenu className="dropdown-link">
                    <FilterContext.Provider value={{handleChange: this.handleChange}}>
                        {this.props.children}
                    </FilterContext.Provider>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}

export class SideListFilterItem extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.filter.handleChange({value: this.props.value, label: this.getLabel()});
    }

    getLabel() {
        if (this.props.label)
            return this.props.label;
        return this.props.value;
    }

    render() {
        return (
            <NavLink to={this.props.linkTo}>
                <DropdownItem className="pointer" onClick={this.handleClick}>{this.getLabel()}</DropdownItem>
            </NavLink>
        );
    }
}

SideListFilterItem = withFilter(SideListFilterItem);

export function SideListOrderSelect(props) {
    return (<>
        <small><Label for="order-select" className="text-muted d-block">Ordering</Label></small>
        <Input type="select" name="select" id="order-select" className="d-inline-block">
            {props.children}
        </Input>
    </>);
}

export const NewItemBtn = withRouter((props) => {
    return (
        <div className="float-right">
            <Button tag={Link} to={props.linkTo} className="bg-red btn-red" id="createItemBtn"><FontAwesomeIcon icon="plus" /></Button>
            <UncontrolledTooltip placement="bottom" target="createItemBtn">
                {props.children}
            </UncontrolledTooltip>
        </div>
    );
});