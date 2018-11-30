import {CLEAR} from "../reducers";

export const GET_TICKETS = 'GET_TICKETS_REQ';
export const GET_TICKET = 'GET_TICKET_REQ';
export const SET_TICKET_ERROR = 'SET_TICKET_ERROR';
export const SET_TICKET = 'SET_TICKET';
export const GET_USER = 'GET_USER_REQ';
export const SUBMIT_FORM = 'SUBMIT_FORM_REQ';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';
export const LOGOUT = 'LOGOUT_REQ';
export const VERIFY_USER = 'VERIFY_USER_REQ';
export const GET_LANGUAGES = 'GET_LANGUAGES_REQ';
export const GET_BUGS = 'GET_BUGS_REQ';
export const GET_BUG = 'GET_BUG_REQ';
export const SET_BUG_ERROR = 'SET_BUG_ERROR';
export const SET_BUG = 'SET_BUG';
export const GET_BUG_TICKET = 'GET_BUG_TICKET_REQ';
export const GET_TICKET_BUG = 'GET_TICKET_BUG_REQ';
export const GET_SEVERITIES = 'GET_SEVERITIES_REQ';
export const GET_MODULES = 'GET_MODULES_REQ';
export const GET_MODULE_BUG = 'GET_MODULE_BUG_REQ';
export const GET_USERS = 'GET_USERS_REQ';

export const CANCEL_ACTION_REQUESTS = 'CANCEL_ACTION_REQUEST';
export const CANCEL_DATA = {cancelled: true};

export function cancelActionRequests(actionType) {
    return { type: CANCEL_ACTION_REQUESTS, actionType: actionType };
}

export function verifyUser() {
    return {
        type: VERIFY_USER,
        payload: {
            request: {
                url: '/auth/logged_in'
            }
        }
    }
}

export function getTickets(query = null) {
    let url = '/api/tickets';
    if (query) {
        url += '?';
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                url += key+'='+query[key]+'&';
            }
        }
    }
    return {
        type: GET_TICKETS,
        payload: {
            request: {
                url: url
            }
        }
    };
}

export function getTicket(ticketId) {
    return {
        type: GET_TICKET,
        id: ticketId,
        payload: {
            request: {
                url: '/api/tickets/'+ticketId
            }
        }
    }
}

export function setTicketError(msg) {
    return {
        type: SET_TICKET_ERROR,
        error: msg
    }
}

export function setTicket(data) {
    return {
        type: SET_TICKET,
        data: data
    }
}

export function submitForm(id, url, data, edit) {
    return {
        type: SUBMIT_FORM,
        id: id,
        payload: {
            request: {
                method: edit ? "patch" : "post",
                url: url,
                data: data
            }
        }
    }
}

export function setToken(token) {
    return {
        type: SET_TOKEN,
        token: token
    }
}

export function setUser(user) {
    return {
        type: SET_USER,
        user: user
    }
}

export function logout() {
    return {
        type: LOGOUT,
        payload: {
            request: {
                method: "post",
                url: "/auth/logout/"
            }
        }
    }
}

export function getUser(username) {
    return {
        type: GET_USER,
        payload: {
            request: {
                url: "/api/users/?username="+username
            }
        }
    }
}

export function getLanguages() {
    return {
        type: GET_LANGUAGES,
        payload: {
            request: {
                url: '/api/languages'
            }
        }
    }
}

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
                url: '/api/bugs/'+id
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
                url: '/api/tickets/'+id
            }
        }
    }
}

export function clearBugTickets() {
    return {
        type: GET_BUG_TICKET+CLEAR
    }
}

export function getTicketBug(id) {
    return {
        type: GET_TICKET_BUG,
        payload: {
            request: {
                url: '/api/bugs/'+id
            }
        }
    }
}

export function clearTicketBugs() {
    return {
        type: GET_TICKET_BUG+CLEAR
    }
}

export function getSeverities() {
    return {
        type: GET_SEVERITIES,
        payload: {
            request: {
                url: '/api/severities/'
            }
        }
    }
}

export function getModules() {
    return {
        type: GET_MODULES,
        payload: {
            request: {
                url: '/api/modules/'
            }
        }
    }
}

export function getModuleBug(id) {
    return {
        type: GET_MODULE_BUG,
        payload: {
            request: {
                url: '/api/bugs/'+id
            }
        }
    }
}

export function clearModuleBugs() {
    return {
        type: GET_MODULE_BUG+CLEAR
    }
}

export function getUsers() {
    return {
        type: GET_USERS,
        payload: {
            request: {
                url: '/api/users'
            }
        }
    }
}
