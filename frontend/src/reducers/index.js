import {TOGGLE_NAVBAR, GET_TICKETS, SUBMIT_FORM} from '../actions'
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
    switch (action.type) {
        case GET_TICKETS: {
            const tickets = copyMerge(state.tickets);
            tickets.loading = true;
            return {
                tickets: tickets
            }
        }

        case GET_TICKETS+SUCC: {
            const tickets = copyMerge(state.tickets);
            tickets.data = action.payload.data.results;
            tickets.loading = false;
            return {
                tickets: tickets
            }
        }

        case GET_TICKETS+FAIL: {
            const tickets = copyMerge(state.tickets);
            tickets.loading = false;
            tickets.error = "Error loading tickets";
            return {
                tickets: tickets
            };
        }
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

