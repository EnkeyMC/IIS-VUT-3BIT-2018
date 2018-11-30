import React from "react";
import {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {getUsers} from "../actions";


export default class Users extends Component {
    componentDidMount() {
        this.props.getUsers();
    }
}

Users = connect (
    state => {
        return {
            users: state.users.data,
            loading: state.users.loading,
            error: state.users.error
        }
    },
    dispatch => {
        return {
            getUsers: () => dispatch(getUsers())
        }
    }
) (Users);
