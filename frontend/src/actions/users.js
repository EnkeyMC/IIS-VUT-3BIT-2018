import {buildQuery} from "./index";

export const GET_USER = 'GET_USER_REQ';
export const GET_USERS = 'GET_USERS_REQ';

export function getUser(username) {
    return {
        type: GET_USER,
        payload: {
            request: {
                url: "/api/users/?username=" + username
            }
        }
    }
}

export function getUsers(query = null) {
    return {
        type: GET_USERS,
        payload: {
            request: {
                url: '/api/users' + buildQuery(query)
            }
        }
    }
}

export function getUsersFiltered(filter) {
    switch (filter) {
        case "users":
            return getUsers({position: "user"});
        case "programmers":
            return getUsers({position: "programmer"});
        case "supervisors":
            return getUsers({position: "supervisor"});
        default:
            return getUsers();
    }
}

export function getUserById(id) {
    return {
        type: GET_USER,
        payload: {
            request: {
                url: "/api/users/"+id+"/"
            }
        }
    }
}