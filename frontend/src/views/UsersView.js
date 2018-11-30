import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import Users from '../components/Users';
import connect from "react-redux/es/connect/connect";
import {getUsers} from "../actions";
import SideList from "../components/SideList";
import {withRouter} from "react-router";

export default class UsersView extends React.Component {
    componentDidMount() {
        this.props.getUsers();
    }

    render () {
        return (
            <DefaultLayout>
                <SideList list={this.props.users} noItems="No users found" itemTag={User}>

                </SideList>
            </DefaultLayout>
        )
    }
}

UsersView = connect (
    state => {
        return {
            users: state.users.data
        }
    },
    dispatch => {
        return {
            getUsers: () => dispatch(getUsers())
        }
    }
) (withRouter(UsersView));


const User = withRouter((props) => {
    const user = props.item;
    return (
        <div>
            {user.id}, {user.username}
        </div>
    );
});