import {buildQuery} from "./index";
import {CLEAR} from "./index";

export const GET_TICKETS = 'GET_TICKETS_REQ';
export const GET_TICKET = 'GET_TICKET_REQ';
export const SET_TICKET_ERROR = 'SET_TICKET_ERROR';
export const SET_TICKET = 'SET_TICKET';
export const GET_TICKET_BUG = 'GET_TICKET_BUG_REQ';
export const GET_TICKETS_FOR_SELECT = 'GET_TICKETS_FOR_SELECT_REQ';

export function getTickets(query = null) {
    let url = '/api/tickets' + buildQuery(query);
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
                url: '/api/tickets/' + ticketId
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

export function getTicketBug(id) {
    return {
        type: GET_TICKET_BUG,
        payload: {
            request: {
                url: '/api/bugs/' + id
            }
        }
    }
}

export function clearTicketBugs() {
    return {
        type: GET_TICKET_BUG + CLEAR
    }
}

export function getTicketsForSelect() {
    return {
        type: GET_TICKETS_FOR_SELECT,
        payload: {
            request: {
                url: '/api/tickets'
            }
        }
    }
}