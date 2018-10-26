import { TOGGLE_NAVBAR, GET_DATA } from '../actions'
import { copyMerge } from '../utils';

const REQ = '_REQ';
const SUCC = '_SUCCESS';
const FAIL = '_FAILURE';

const initialState = {
    navbarIsOpen: false,
    ajaxInProgress: 0,
    data: [],
    error: null
};

export function zeroBugsApp(state = initialState, action) {
    if (action.type.endsWith(REQ))
        return reduce(copyMerge(state, {ajaxInProgress: state.ajaxInProgress + 1}), action);
    else if (action.type.endsWith(SUCC) || action.type.endsWith(FAIL))
        return reduce(copyMerge(state, {ajaxInProgress: state.ajaxInProgress - 1}), action);
    return reduce(copyMerge(state), action);
}

function reduce(state, action) {
    switch (action.type) {
        case TOGGLE_NAVBAR:
            state.navbarIsOpen = !state.navbarIsOpen;
            return state;
        case GET_DATA+SUCC:
            state.data = action.payload.data.data;
            return state;
        case GET_DATA+FAIL:
            state.error = action.payload.statusText;
            return state;
        default:
            return state;
    }
}

