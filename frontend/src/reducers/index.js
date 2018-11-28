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
    SET_BUG_ERROR,
    GET_BUG_TICKET,
    CLEAR_BUG_TICKETS,
    GET_TICKET_BUG,
    CLEAR_TICKET_BUGS,
    GET_SEVERITIES,
    GET_MODULES,
    GET_MODULE_BUG,
    CLEAR_MODULE_BUGS,
    SET_BUG, SET_TICKET
} from '../actions'
import { copyMerge } from '../utils';
import {combineReducers} from "redux";
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';

const SUCC = '_SUCCESS';
const FAIL = '_FAIL';
export const CLEAR = '_CLEAR';

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

const initialSeveritiesState = {
    loading: false,
    error: null,
    data: null
};

const initialModulesState = {
    loading: false,
    error: null,
    data: null,
    moduleBugs: {
        loading: 0,
        error: null,
        data: []
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
    severities: reduceSeverities,
    modules: reduceModules,
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
        tickets: reduceGetList(state.tickets, action, GET_TICKETS),
        ticketInfo: Object.assign(
            reduceGetTicket(state.ticketInfo, action),
            {ticketBugs: reduceSingleToList(state.ticketInfo.ticketBugs, action, GET_TICKET_BUG)}
        )
    };
}

function reduceGetList(state, action, ACTION) {
    switch (action.type) {
        case ACTION:
            return copyMerge(state, {
                loading: true,
                data: null,
                error: null
            });
        case ACTION+SUCC:
            return copyMerge(state, {
                loading: false,
                data: action.payload.data.results
            });
        case ACTION+FAIL:
            return copyMerge(state, {
                loading: false,
                error: action.error.message
            });
        default:
            return state;
    }
}

function reduceSingleToList(state, action, ACTION) {
    switch (action.type) {
        case ACTION:
            return copyMerge(state, {
                loading: state.loading + 1
            });
        case ACTION+SUCC:
            return copyMerge(state, {
                loading: state.loading - 1,
                data: state.data.concat([action.payload.data])
            });
        case ACTION+FAIL:
            return copyMerge(state, {
                loading: state.loading - 1,
                error: state.error === null ? [action.error.message] : state.error.concat([action.error.message])
            });
        case ACTION+CLEAR:
            return copyMerge(state, {
                loading: 0,
                error: null,
                data: []
            });
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
        case SET_TICKET:
            return copyMerge(state, {data: action.data});
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
    return reduceGetList(state, action, GET_LANGUAGES);
}

function reduceBugView(state = initialBugsViewState, action) {
    return {
        bugs: reduceGetList(state.bugs, action, GET_BUGS),
        bugInfo: Object.assign(
            reduceGetBug(state.bugInfo, action),
            {bugTickets: reduceSingleToList(state.bugInfo.bugTickets, action, GET_BUG_TICKET)}
        )
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
        case SET_BUG:
            return copyMerge(state, {data: action.data});
        default:
            return state;
    }
}

function reduceSeverities(state = initialSeveritiesState, action) {
    return reduceGetList(state, action, GET_SEVERITIES);
}

function reduceModules(state = initialModulesState, action) {
    return copyMerge(
        reduceGetList(state, action, GET_MODULES),
        {moduleBugs: reduceSingleToList(state.moduleBugs, action, GET_MODULE_BUG)}
    )
}