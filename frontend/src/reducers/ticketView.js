import {FAIL, SUCC} from "../actions";
import {copyMerge} from "../utils";
import {initialSingleToListState, initialState, isCancelled} from "./helpers";
import {reduceGetList, reduceSingleToList} from "./helpers";
import {
    GET_TICKET,
    GET_TICKET_BUG,
    GET_TICKETS,
    GET_TICKETS_FOR_SELECT,
    SET_TICKET,
    SET_TICKET_ERROR
} from "../actions/tickets";

const initialTicketsViewState = {
    tickets: initialState,
    ticketInfo: copyMerge(initialState, {
        ticketBugs: initialSingleToListState,
        ticketsForSelect: initialState  // For forms
    })
};

export function reduceTicketView(state = initialTicketsViewState, action) {
    return {
        tickets: reduceGetList(state.tickets, action, GET_TICKETS),
        ticketInfo: Object.assign(
            reduceGetTicket(state.ticketInfo, action),
            {
                ticketBugs: reduceSingleToList(state.ticketInfo.ticketBugs, action, GET_TICKET_BUG),
                ticketsForSelect: reduceGetList(state.ticketInfo.ticketsForSelect, action, GET_TICKETS_FOR_SELECT)
            }
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