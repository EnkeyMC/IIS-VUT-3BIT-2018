import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import Users from '../components/Users';
import connect from "react-redux/es/connect/connect";
import {getUsers} from "../actions/users";
import SideList, {SideListFilter, SideListFilterItem, SideListHeader} from "../components/SideList";
import {withRouter} from "react-router";
import {NavLink} from "react-router-dom";
import {appendToPath} from "../utils";
import pathToRegexp from "path-to-regexp";

export default class UsersView extends React.Component {
    componentDidMount() {
        this.props.getUsers();
    }

    render () {
        const position = this.props.match.params.position;

        return (
            <DefaultLayout>
                <SideList list={this.props.users} noItems="No users found" itemTag={User}>
                    <SideListHeader
                        title="Users"
                        filter={
                            <SideListFilter
                                value={{value: position}}
                                defaultValue={{value: "all"}}
                            >
                                <SideListFilterItem linkTo="/users/all" value="all" />
                                <SideListFilterItem linkTo="/users/supervisor" value="supervisor" />
                                <SideListFilterItem linkTo="/users/programmers" value="programmer" />
                                <SideListFilterItem linkTo="/users/users" value="user" />
                            </SideListFilter>
                        }/>
                </SideList>
                <Users/>
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
            getUsers: () => dispatch(getUsers())
        }
    }
) (withRouter(UsersView));


const User = withRouter((props) => {
    const toPath = pathToRegexp.compile(props.match.path);
    return (
        <NavLink to={appendToPath(toPath({status: props.match.params.posiiton}), props.item.id)} className={"list-group-item list-group-item-action flex-column align-items-start state-" + props.item.position} activeClassName="selected">
            <div className="d-flex w-100 justify-content-between">
                <h6 className="pb-1 ticket-list-title">{props.item.username}</h6>
            </div>
            <small className="float-left">{props.item.first_name} {props.item.last_name}</small>
            <small className="float-right">{props.item.position}</small>
        </NavLink>
    );
});