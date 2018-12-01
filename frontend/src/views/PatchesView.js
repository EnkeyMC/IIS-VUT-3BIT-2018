import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import {NewItemBtn, SideListFilter, SideListFilterItem, SideListHeader} from "../components/SideList";
import {RestrictedView, ROLE_PROGRAMMER, ROLE_USER} from "../components/RoleRestriction";
import SideList from "../components/SideList";
import {NavLink} from "react-router-dom";
import {appendToPath} from "../utils";
import pathToRegexp from "path-to-regexp";
import {connect} from "react-redux";
import {getFilteredPatches} from "../actions/patches";
import {withRouter} from "react-router";
import Observable from "../utils/Observable";

const PATCH_STATUSES = [
    "in progress",
    "awaiting approval",
    "approved",
    "released"
];

export default class PatchesView extends React.Component {
    constructor(props) {
        super(props);

        this.statusObservable = new Observable(this.props.match.params.status, val => {
            this.props.getFilteredPatches(PatchesView.statusDecode(val));
        });
    }

    componentDidMount() {
        this.statusObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.statusObservable.update(this.props.match.params.status);
    }

    static statusEncode(status) {
        return status.replace(' ', '-');
    }

    static statusDecode(status) {
        return status.replace('-', ' ');
    }

    render () {
        const status = this.props.match.params.status;
        const toPath = pathToRegexp.compile(this.props.match.path);
        const path = toPath({status: status});
        return (
            <DefaultLayout>
                <SideList list={this.props.patches} noItems="No patches found" itemTag={Patch}>
                    <SideListHeader
                        title="Patches"
                        filter={
                            <SideListFilter
                                value={{value: PatchesView.statusDecode(status)}}
                                defaultValue={{value: "all"}}
                            >
                                <SideListFilterItem linkTo="/patches/all" value="all" />
                                {PATCH_STATUSES.map(s => <SideListFilterItem key={s} linkTo={"/patches/"+PatchesView.statusEncode(s)} value={s} />)}
                                <RestrictedView minRole={ROLE_PROGRAMMER}>
                                    <SideListFilterItem linkTo="/patches/my" value="my" />
                                </RestrictedView>
                            </SideListFilter>
                        }
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
            patches: state.patches,
            username: state.global.user ? state.global.user.username : null
        }
    },
    dispatch => {
        return {
            getFilteredPatches: (filter) => dispatch(getFilteredPatches(filter))
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