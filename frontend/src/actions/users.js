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