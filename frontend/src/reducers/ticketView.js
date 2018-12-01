import {FAIL, SUCC} from "../actions";
import {copyMerge} from "../utils";
import {isCancelled} from "./helpers";
import {reduceGetList, reduceSingleToList} from "./helpers";
import {GET_TICKET, GET_TICKET_BUG, GET_TICKETS, SET_TICKET, SET_TICKET_ERROR} from "../actions/tickets";

const initialTicketsViewState = {
    tickets: {
        loading: false,
        error: null,
        data: null
    },
    ticketInfo: {
        loading: false,
        error: null,
        data: null,
        ticketBugs: {
            loading: 0,
            error: null,
            data: []
        }
    }
};

export function reduceTicketView(state = initialTicketsViewState, action) {
    return {
        tickets: reduceGetList(state.tickets, action, GET_TICKETS),
        ticketInfo: Object.assign(
            reduceGetTicket(state.ticketInfo, action),
            {ticketBugs: reduceSingleToList(state.ticketInfo.ticketBugs, action, GET_TICKET_BUG)}
        )
    };
}

function reduceGetTicket(state, action) {
    switch (action.type) {
        case GET_TICKET:
            return copyMerge(state, {loading: true, error: false, data: null});
        case GET_TICKET + SUCC: {
            return copyMerge(state, {
                loading: false,
                error: null,
                data: copyMerge(state.data, action.payload.data)
            });
        }
        case GET_TICKET + FAIL:
            if (isCancelled(action))
                return copyMerge(state, {loading: false});
            if (action.error.response.status === 404)
                return copyMerge(state, {loading: false, error: "Ticket not found"});
            return copyMerge(state, {loading: false, error: action.error.message});
        case SET_TICKET_ERROR:
            return copyMerge(state, {error: action.error});
        case SET_TICKET:
            return copyMerge(state, {data: action.data});
        default:
            return state;
    }
}