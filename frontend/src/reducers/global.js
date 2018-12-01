import {FAIL, SUCC} from "../actions";
import {copyMerge} from "../utils";
import {LOGOUT, SET_TOKEN, SET_USER, VERIFY_USER} from "../actions/global";

const initialGlobalState = {
    user: JSON.parse(localStorage.getItem('AUTH_USER')),
    token: localStorage.getItem('AUTH_TOKEN'),
    verifyingUser: true
};

export function reduceGlobal(state = initialGlobalState, action) {
    switch (action.type) {
        case SET_TOKEN:
            return copyMerge(state, {token: action.token});
        case SET_USER:
            return copyMerge(state, {user: action.user});
        case LOGOUT + SUCC:
            return copyMerge(state, {user: null, token: null});
        case VERIFY_USER:
            return copyMerge(state, {verifyingUser: true});
        case VERIFY_USER + SUCC:
            return copyMerge(state, {verifyingUser: false, user: action.payload.data.user});
        case VERIFY_USER + FAIL:
            return copyMerge(state, {verifyingUser: false, user: null, token: null});
        default:
            return state;
    }
}