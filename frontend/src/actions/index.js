export const GET_TICKETS = 'GET_TICKETS_REQ';
export const GET_TICKET = 'GET_TICKET_REQ';
export const SET_TICKET_ERROR = 'SET_TICKET_ERROR';
export const GET_USER = 'GET_USER_REQ';
export const SUBMIT_FORM = 'SUBMIT_FORM_REQ';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';
export const LOGOUT = 'LOGOUT_REQ';
export const VERIFY_USER = 'VERIFY_USER_REQ';


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

export function submitForm(id, url, data) {
    return {
        type: SUBMIT_FORM,
        id: id,
        payload: {
            request: {
                method: "post",
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
