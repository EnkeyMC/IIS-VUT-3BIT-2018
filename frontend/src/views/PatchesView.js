import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import {NewItemBtn, SideListFilter, SideListFilterItem, SideListHeader} from "../components/SideList";
import {RestrictedView, ROLE_USER} from "../components/RoleRestriction";
import SideList from "../components/SideList";
import {NavLink} from "react-router-dom";
import {appendToPath} from "../utils";
import pathToRegexp from "path-to-regexp";
import {connect} from "react-redux";
import {getPatches} from "../actions";
import {withRouter} from "react-router";

export default class PatchesView extends React.Component {
    componentDidMount() {
        this.props.getPatches();
    }

    render () {

        const toPath = pathToRegexp.compile(this.props.match.path);
        // const path = toPath({status: this.props.match.params.status});
        const path = toPath({});
        return (
            <DefaultLayout>
                <SideList list={this.props.patches} noItems="No patches found" itemTag={Patch}>
                    <SideListHeader
                        title="Patches"

                        newBtn={
                            <NewItemBtn linkTo={path+'/create'}>
                                Create New Patch
                            </NewItemBtn>
                        }
                    />
                </SideList>
            </DefaultLayout>
        )
    }
}

PatchesView = connect(
    state => {
        return {
            patches: state.patches
        }
    },
    dispatch => {
        return {
            getPatches: (query) => dispatch(getPatches(query))
        }
    }
)(withRouter(PatchesView));

const Patch = withRouter((props) => {
    const toPath = pathToRegexp.compile(props.match.path);
    return (
        <NavLink to={appendToPath(toPath({status: props.match.params.status}), props.item.id)} activeClassName="selected" className={"list-group-item list-group-item-action flex-column align-items-start state-" + props.item.status}>
            <div className="d-flex w-100 justify-content-between">
                <h6 className="pb-1 ticket-list-title">#{props.item.id}</h6>
            </div>
            <small className="float-left">{props.item.author}</small>
            <small className="float-right">{props.item.created}</small>
        </NavLink>
    );
});