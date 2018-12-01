import {buildQuery, CLEAR} from "./index";

export const GET_BUGS = 'GET_BUGS_REQ';
export const GET_BUG = 'GET_BUG_REQ';
export const SET_BUG_ERROR = 'SET_BUG_ERROR';
export const SET_BUG = 'SET_BUG';
export const GET_BUG_TICKET = 'GET_BUG_TICKET_REQ';

export function getBugs(query = null) {console.log(query);
    return {
        type: GET_BUGS,
        payload: {
            request: {
                url: '/api/bugs/'+buildQuery(query)
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

export const F_ALL = "All";
export const F_VULNERABILITIES = "Vulnerabilities";

export function getBugsFiltered(filter) {
    if (!filter || filter === F_ALL) {
        return getBugs();
    } else if (filter === F_VULNERABILITIES) {
        return getBugs({vulnerability: true});
    } else {
        return getBugs({severity: filter});
    }
}