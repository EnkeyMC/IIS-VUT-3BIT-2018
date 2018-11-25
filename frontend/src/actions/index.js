export const GET_TICKETS = 'GET_TICKETS_REQ';
export const GET_TICKET = 'GET_TICKET_REQ';
export const SET_TICKET_ERROR = 'SET_TICKET_ERROR';
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
export const GET_BUG_TICKET = 'GET_BUG_TICKET_REQ';
export const CLEAR_BUG_TICKETS = 'CLEAR_BUG_TICKETS';
export const GET_TICKET_BUG = 'GET_TICKET_BUG_REQ';
export const CLEAR_TICKET_BUGS = 'CLEAR_TICKET_BUGS';

export const CANCEL_ACTION_REQUESTS = 'CANCEL_ACTION_REQUEST';
export const CANCEL_DATA = {cancelled: true};

export function cancelActionRequests(actionType) {
    return { type: CANCEL_ACTION_REQUESTS, actionType };
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

export function getTickets(status = null) {
    let url = '/api/tickets';
    if (status)
        url += '?status='+status;
    return {
        type: GET_TICKETS,
        payload: {
            request: {
                url: url
            }
        }
    };
}

export function getUserTickets(username) {
    return {
        type: GET_TICKETS,
        payload: {
            request: {
                url: '/api/tickets?username='+username
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
        type: CLEAR_BUG_TICKETS
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
        type: CLEAR_TICKET_BUGS
    }
}
