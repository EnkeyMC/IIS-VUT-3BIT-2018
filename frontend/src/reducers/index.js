import {
    GET_TICKETS,
    GET_TICKET,
    SET_TOKEN,
    SET_USER,
    LOGOUT,
    GET_USER,
    VERIFY_USER,
    SET_TICKET_ERROR,
    GET_LANGUAGES,
    GET_BUGS,
    GET_BUG,
    SET_BUG_ERROR, GET_BUG_TICKET, CLEAR_BUG_TICKETS, GET_TICKET_BUG, CLEAR_TICKET_BUGS
} from '../actions'
import { copyMerge } from '../utils';
import {combineReducers} from "redux";
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';

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

const initialProfileViewState = {
    user: null,
    loading: false,
    error: null
};

const initialLanguageListState = {
    loading: false,
    error: null,
    data: null
};

const initialBugsViewState = {
    bugs: {
        loading: false,
        error: null,
        data: null
    },
    bugInfo: {
        loading: false,
        error: null,
        data: null,
        bugTickets: {
            loading: 0,
            error: null,
            data: []
        }
    }
};

export const zeroBugsApp = (state, action) => {
    console.log("State before", state);
    console.log("Action", action);

    const newState = rootReducer(state, action);
    console.log("State after", newState);
    return newState;
};

export const history = createBrowserHistory();

const rootReducer = combineReducers({
    router: connectRouter(history),
    global: reduceGlobal,
    ticketView: reduceTicketView,
    profileView: reduceUserView,
    languages: reduceLanguageList,
    bugView: reduceBugView,
});

function reduceGlobal(state = initialGlobalState, action) {
    switch (action.type) {
        case SET_TOKEN:
            return copyMerge(state, {token: action.token});
        case SET_USER:
            return copyMerge(state, {user: action.user});
        case LOGOUT+SUCC:
            return copyMerge(state, {user: null, token: null});
        case VERIFY_USER:
            return copyMerge(state, {verifyingUser: true});
        case VERIFY_USER+SUCC:
            return copyMerge(state, {verifyingUser: false, user: action.payload.data.user});
        case VERIFY_USER+FAIL:
            return copyMerge(state, {verifyingUser: false, user: null, token: null});
        default:
            return state;
    }
}

function reduceTicketView(state = initialTicketsViewState, action) {
    return {
        tickets: reduceGetTickets(state.tickets, action),
        ticketInfo: Object.assign(
            reduceGetTicket(state.ticketInfo, action),
            {ticketBugs: reduceTicketBugs(state.ticketInfo.ticketBugs, action)}
        )
    };
}

function reduceGetTickets(state, action) {
    switch (action.type) {
        case GET_TICKETS: {
            const tickets = copyMerge(state);
            tickets.loading = true;
            tickets.error = null;
            tickets.data = null;
            return tickets;
        }

        case GET_TICKETS+SUCC: {
            const tickets = copyMerge(state);
            tickets.data = action.payload.data.results;
            tickets.loading = false;
            tickets.error = null;
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
            return copyMerge(state, {loading: true, error: false, data: null});
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
        case SET_TICKET_ERROR:
            return copyMerge(state, {error: action.error});
        default:
            return state;
    }
}

function reduceTicketBugs(state, action) {
    switch (action.type) {
        case GET_TICKET_BUG:
            return copyMerge(state, {
                loading: state.loading + 1
            });
        case GET_TICKET_BUG+SUCC:
            return copyMerge(state, {
                loading: state.loading - 1,
                data: state.data.concat([action.payload.data])
            });
        case GET_TICKET_BUG+FAIL:
            return copyMerge(state, {
                loading: state.loading - 1,
                error: state.error === null ? [action.error.message] : state.error.concat([action.error.message])
            });
        case CLEAR_TICKET_BUGS:
            return copyMerge(state, {
                loading: 0,
                error: null,
                data: []
            });
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

function reduceLanguageList(state = initialLanguageListState, action) {
    switch (action.type) {
        case GET_LANGUAGES:
            return copyMerge(state, {loading: true, error:null});
        case GET_LANGUAGES+SUCC:
            return copyMerge(state, {loading: false, data: action.payload.data.results});
        case GET_LANGUAGES+FAIL:
            return copyMerge(state, {loading: false, data: null, error: action.error.message});
        default:
            return state;
    }
}

function reduceBugView(state = initialBugsViewState, action) {
    return {
        bugs: reduceGetBugs(state.bugs, action),
        bugInfo: Object.assign(
            reduceGetBug(state.bugInfo, action),
            {bugTickets: reduceBugTickets(state.bugInfo.bugTickets, action)}
        )
    }
}

function reduceGetBugs(state, action) {
    switch (action.type) {
        case GET_BUGS: {
            return copyMerge(state, {
                data: null,
                loading: true,
                error: null
            });
        }

        case GET_BUGS+SUCC: {
            return copyMerge(state, {
                data: action.payload.data.results,
                loading: false,
                error: null,
            });
        }

        case GET_BUGS+FAIL: {
            return copyMerge(state, {
                data: null,
                loading: false,
                error: action.error.message
            });
        }
        default:
            return state;
    }
}

function reduceGetBug(state, action) {
    switch (action.type) {
        case GET_BUG:
            return copyMerge(state, {loading: true, error: false, data: null});
        case GET_BUG+SUCC: {
            return copyMerge(state, {
                loading: false,
                error: null,
                data: copyMerge(state.data, action.payload.data)
            });
        }
        case GET_BUG+FAIL:
            if (action.error.response.status === 404)
                return copyMerge(state, {loading: false, error: "Bug not found"});
            return copyMerge(state, {loading: false, error: action.error.message});
        case SET_BUG_ERROR:
            return copyMerge(state, {error: action.error});
        default:
            return state;
    }
}

function reduceBugTickets(state, action) {
    switch (action.type) {
        case GET_BUG_TICKET:
            return copyMerge(state, {
                loading: state.loading + 1
            });
        case GET_BUG_TICKET+SUCC:
            return copyMerge(state, {
                loading: state.loading - 1,
                data: state.data.concat([action.payload.data])
            });
        case GET_BUG_TICKET+FAIL:
            return copyMerge(state, {
                loading: state.loading - 1,
                error: state.error === null ? [action.error.message] : state.error.concat([action.error.message])
            });
        case CLEAR_BUG_TICKETS:
            return copyMerge(state, {
                loading: 0,
                error: null,
                data: []
            });
        default:
            return state;
    }
}
