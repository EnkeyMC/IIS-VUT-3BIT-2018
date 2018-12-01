import {CLEAR} from "./index";

export const GET_BUGS = 'GET_BUGS_REQ';
export const GET_BUG = 'GET_BUG_REQ';
export const SET_BUG_ERROR = 'SET_BUG_ERROR';
export const SET_BUG = 'SET_BUG';
export const GET_BUG_TICKET = 'GET_BUG_TICKET_REQ';

export function getBugs() {
    return {
        type: GET_BUGS,
        payload: {
            request: {
                url: '/api/bugs'
            }
        }
    }
}

export function getBug(id) {
    return {
        type: GET_BUG,
        payload: {
            request: {
                url: '/api/bugs/' + id
            }
        }
    }
}

export function setBugError(msg) {
    return {
        type: SET_BUG_ERROR,
        error: msg
    }
}

export function setBug(data) {
    return {
        type: SET_BUG,
        data: data
    }
}

export function getBugTicket(id) {
    return {
        type: GET_BUG_TICKET,
        payload: {
            request: {
                url: '/api/tickets/' + id
            }
        }
    }
}

export function clearBugTickets() {
    return {
        type: GET_BUG_TICKET + CLEAR
    }
}