import {FAIL, SUCC} from "../actions";
import {copyMerge} from "../utils";
import {GET_USER} from "../actions/users";

const initialProfileViewState = {
    user: null,
    loading: false,
    error: null
};

export function reduceUserView(state = initialProfileViewState, action) {
    switch (action.type) {
        case GET_USER:
            return copyMerge(state, {loading: true, error: null});
        case GET_USER + SUCC:
            if (typeof action.payload.data.results === "undefined")
                return copyMerge(state, {user: action.payload.data, loading: false, error: null});
            if (action.payload.data.count === 0)
                return copyMerge(state, {user: null, loading: false, error: "User not found"});
            return copyMerge(state, {user: action.payload.data.results[0], loading: false, error: null});
        case GET_USER + FAIL:
            return copyMerge(state, {loading: false, error: action.error.message});
        default:
            return state;
    }
}