import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import {NewItemBtn, SideListFilter, SideListFilterItem, SideListHeader} from "../components/SideList";
import {RestrictedRoute, RestrictedView, ROLE_PROGRAMMER} from "../components/RoleRestriction";
import SideList from "../components/SideList";
import {NavLink} from "react-router-dom";
import {appendToPath} from "../utils";
import pathToRegexp from "path-to-regexp";
import {connect} from "react-redux";
import {getFilteredPatches} from "../actions/patches";
import {Route, Switch, withRouter} from "react-router";
import Observable from "../utils/Observable";
import PatchCreate from "../components/PatchCreate";
import PatchInfo from "../components/PatchInfo";
import PatchEdit from "../components/PatchEdit";

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
        let defaultId = null;
        const data = this.props.patches.data;
        if (data && data.length > 0)
            defaultId = data[0].id;

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
                            <RestrictedView minRole={ROLE_PROGRAMMER}>
                                <NewItemBtn linkTo={path+'/create'}>
                                    Create New Patch
                                </NewItemBtn>
                            </RestrictedView>
                        }
                    />
                </SideList>
                <Switch>
                    <RestrictedRoute minRole={ROLE_PROGRAMMER} path={this.props.match.path+'/create'} component={PatchCreate} />
                    <Route path={this.props.match.path+'/:id(\\d+)/edit'} component={PatchEdit} />
                    <Route path={this.props.match.path+'/:id(\\d+)?'} render={props => <PatchInfo {...props} defaultId={defaultId} />} />
                </Switch>
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
        <NavLink to={appendToPath(toPath({status: props.match.params.status}), props.item.id)} activeClassName="selected" className={"list-group-item list-group-item-action flex-column align-items-start state-" + PatchesView.statusEncode(props.item.status)}>
            <div className="d-flex w-100 justify-content-between">
                <h6 className="pb-1 ticket-list-title">#{props.item.id} {props.item.name}</h6>
            </div>
            <small className="float-left">{props.item.author}</small>
            <small className="float-right">{props.item.status}</small>
        </NavLink>
    );
});