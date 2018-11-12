export const GET_TICKETS = 'GET_TICKETS_REQ';
export const GET_TICKET = 'GET_TICKET_REQ';
export const SUBMIT_FORM = 'SUBMIT_FORM';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';
export const LOGOUT = 'LOGOUT';


export function getTickets() {
    return {
        type: GET_TICKETS,
        payload: {
            request: {
                url: '/api/tickets'
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

export function submitForm(id, url, data) {
    return {
        type: SUBMIT_FORM,
        id: id,
        payload:{
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
                method: "get",
                url: "/auth/logout/"
            }
        }
    }
}
