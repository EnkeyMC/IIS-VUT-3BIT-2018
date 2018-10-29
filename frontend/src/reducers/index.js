import {TOGGLE_NAVBAR, GET_DATA, SUBMIT_FORM, HANDLE_CHANGE} from '../actions'
import { copyMerge } from '../utils';

const REQ = '_REQ';
const SUCC = '_SUCCESS';
const FAIL = '_FAIL';

const initialState = {
    navbarIsOpen: false,
    ajaxInProgress: 0,
    data: [],
    error: null,
    forms: {}
};

export function zeroBugsApp(state = initialState, action) {
    console.log(action.type);
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
        case GET_DATA+SUCC:console.log(action.payload);
            state.data = action.payload.data.results;
            return state;
        case GET_DATA+FAIL:
            state.error = action.error.statusText;
            return state;
        case SUBMIT_FORM:
        case HANDLE_CHANGE:
            return reduceForms(state, action);
        default:
            return state;
    }
}

function reduceForms(state, action) {
    switch (action.type) {
        case SUBMIT_FORM: {
            return state;
        }

        case HANDLE_CHANGE: {
            const fields = state.forms["fields"] ? state.forms.fields : {};
            return {
                forms: copyMerge(state.forms, {
                    fields: copyMerge(fields, {
                        [action.field]: action.value
                    })
                })
            }
        }

        default:
            return state;
    }
}

