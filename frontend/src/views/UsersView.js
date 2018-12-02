import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import UserInfo from '../components/UserInfo';
import {getUsersFiltered} from "../actions/users";
import SideList, {NewItemBtn, SideListFilter, SideListFilterItem, SideListHeader} from "../components/SideList";
import {Route, Switch, withRouter} from "react-router";
import {NavLink} from "react-router-dom";
import {appendToPath} from "../utils";
import pathToRegexp from "path-to-regexp";
import {connect} from "react-redux";
import Observable from "../utils/Observable";

export default class UsersView extends React.Component {
    constructor(props) {
        super(props);

        this.positionObservable = new Observable(this.props.match.params.position, val => {
            this.props.getUsersFiltered(val);
        });
    }


    componentDidMount() {
        this.positionObservable.triggerOnChanged();
    }

    componentDidUpdate() {
        this.positionObservable.update(this.props.match.params.position);
    }

    render () {
        const position = this.props.match.params.position;

        let defaultId = null;
        const data = this.props.users.data;
        if (data && data.length > 0)
            defaultId = data[0].id;

        return (
            <DefaultLayout>
                <SideList list={this.props.users} noItems="No users found" itemTag={User}>
                    <SideListHeader
                        title="Users"
                        newBtn={
                            <NewItemBtn linkTo={'/register'}>
                                Register User
                            </NewItemBtn>
                        }
                        filter={
                            <SideListFilter
                                value={{value: position}}
                                defaultValue={{value: "all"}}
                            >
                                <SideListFilterItem linkTo="/users/all" value="all" />
                                <SideListFilterItem linkTo="/users/users" value="users" />
                                <SideListFilterItem linkTo="/users/programmers" value="programmers" />
                                <SideListFilterItem linkTo="/users/supervisors" value="supervisors" />
                            </SideListFilter>
                        }/>
                </SideList>
                <Switch>
                    <Route path={this.props.match.path+'/:id(\\d+)?'} render={props => <UserInfo defaultId={defaultId} {...props}/>} />
                </Switch>
            </DefaultLayout>
        )
    }
}

UsersView = connect (
    state => {
        return {
            users: state.users
        }
    },
    dispatch => {
        return {
            getUsersFiltered: (filter) => dispatch(getUsersFiltered(filter))
        }
    }
) (withRouter(UsersView));


const User = withRouter((props) => {
    const toPath = pathToRegexp.compile(props.match.path);
    return (
        <NavLink to={appendToPath(toPath({position: props.match.params.position}), props.item.id)} className={"list-group-item list-group-item-action flex-column align-items-start state-" + props.item.position} activeClassName="selected">
            <div className="d-flex w-100 justify-content-between">
                <h6 className="pb-1 ticket-list-title">
                    {props.item.username}
                    {
                        props.item.is_active === false ?
                        <small className="text-muted d-inline"> inactive</small>
                        :
                        null
                    }
                </h6>
            </div>
            <small className="float-left">{props.item.first_name} {props.item.last_name}</small>
            <small className="float-right">{props.item.position}</small>
        </NavLink>
    );
});