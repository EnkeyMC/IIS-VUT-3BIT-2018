import {GET_TICKETS, SUBMIT_FORM, GET_TICKET, SET_TOKEN, SET_USER, LOGOUT, GET_USER, VERIFY_USER} from '../actions'
import { copyMerge } from '../utils';
import {combineReducers} from "redux";

// const REQ = '_REQ';
const SUCC = '_SUCCESS';
const FAIL = '_FAIL';

const initialGlobalState = {
    user: JSON.parse(localStorage.getItem('AUTH_USER')),
    token: localStorage.getItem('AUTH_TOKEN'),
    verifyingUser: true
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
        data: null
    }
};

const initialProfileViewState = {
    user: null,
    loading: false,
    error: null
};

export const zeroBugsApp = (state, action) => {
    console.log(state);
    console.log(action);

    const newState = rootReducer(state, action);
    console.log(newState);
    return newState;
};

const rootReducer = combineReducers({
    global: reduceGlobal,
    ticketView: reduceTicketView,
    forms: reduceForms,
    profileView: reduceUserView
});

function reduceGlobal(state = initialGlobalState, action) {
    switch (action.type) {
        case SET_TOKEN:
            return copyMerge(state, {token: action.token});
        case SET_USER:
            return copyMerge(state, {user: action.user});
        case LOGOUT+SUCC:
            return copyMerge(state, {user: null, token: null});
        case VERIFY_USER+SUCC:
            return copyMerge(state, {verifyingUser: false});
        case VERIFY_USER+FAIL:
            return copyMerge(state, {verifyingUser: false, user: null, token: null});
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
            tickets.error = null;
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
            tickets.error = action.error.message;
            return tickets;
        }
        default:
            return state;
    }
}

function reduceGetTicket(state, action) {
    switch (action.type) {
        case GET_TICKET:
            return copyMerge(state, {loading: true, error: false});
        case GET_TICKET+SUCC: {
            return copyMerge(state, {
                loading: false,
                error: null,
                data: copyMerge(state.data, action.payload.data)
            });
        }
        case GET_TICKET+FAIL:
            if (action.error.response.status === 404)
                return copyMerge(state, {loading: false, error: "Ticket not found"});
            return copyMerge(state, {loading: false, error: action.error.message});
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

function reduceUserView(state = initialProfileViewState, action) {
    switch (action.type) {
        case GET_USER:
            return copyMerge(state, {loading: true, error: null});
        case GET_USER+SUCC:
            if (action.payload.data.count === 0)
                return copyMerge(state, {user: null, loading: false, error: "User not found"});
            return copyMerge(state, {user: action.payload.data.results[0], loading: false});
        case GET_USER+FAIL:
            return copyMerge(state, {loading: false, error: action.error.message});
        default:
            return state;
    }
}

