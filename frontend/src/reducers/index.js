import {TOGGLE_NAVBAR, GET_TICKETS, SUBMIT_FORM, GET_TICKET} from '../actions'
import { copyMerge } from '../utils';
import {combineReducers} from "redux";

// const REQ = '_REQ';
const SUCC = '_SUCCESS';
const FAIL = '_FAIL';

const initialGlobalState = {
    navbarIsOpen: false,
};

const initialTicketsViewState = {
    tickets: {
        loading: false,
        error: null,
        data: []
    },
    ticketInfo: {
        loading: false,
        error: null,
        data: {}
    }
};

export const zeroBugsApp = combineReducers({
    global: reduceGlobal,
    ticketView: reduceTicketView,
    forms: reduceForms,
});

function reduceGlobal(state = initialGlobalState, action) {
    console.log(action);
    switch (action.type) {
        case TOGGLE_NAVBAR:
            return {navbarIsOpen: !state.navbarIsOpen};
        default:
            return state;
    }
}

function reduceTicketView(state = initialTicketsViewState, action) {
    return {
        tickets: reduceGetTickets(state.tickets, action),
        ticketInfo: reduceGetTicket(state.ticketInfo, action)
    };
}

function reduceGetTickets(state, action) {
    switch (action.type) {
        case GET_TICKETS: {
            const tickets = copyMerge(state);
            tickets.loading = true;
            return tickets;
        }

        case GET_TICKETS+SUCC: {
            const tickets = copyMerge(state);
            tickets.data = action.payload.data.results;
            tickets.loading = false;
            return tickets;
        }

        case GET_TICKETS+FAIL: {
            const tickets = copyMerge(state);
            tickets.loading = false;
            tickets.error = "Error loading tickets";
            return tickets;
        }
        default:
            return state;
    }
}

function reduceGetTicket(state, action) {
    switch (action.type) {
        case GET_TICKET:
            return {loading: action.id};
        case GET_TICKET+SUCC: {
            const id = action.payload.data.id;
            return {
                loading: false,
                data: copyMerge(state.data, {
                    [id]: action.payload.data
                })
            };
        }
        case GET_TICKET+FAIL:
            return {loading: false, error: "Error loading ticket"};
        default:
            return state;
    }
}

function reduceForms(state = {}, action) {
    switch (action.type) {
        case SUBMIT_FORM: {
            return state;
        }

        default:
            return state;
    }
}

