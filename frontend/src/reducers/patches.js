import {initialState, isCancelled} from "./helpers";
import {copyMerge} from "../utils";
import {FAIL, SUCC} from "../actions";
import {GET_PATCH} from "../actions/patches";

export function reducePatch(state = initialState, action) {
    switch (action.type) {
        case GET_PATCH:
            return copyMerge(state, {loading: true, error: false, data: null});
        case GET_PATCH + SUCC: {
            return copyMerge(state, {
                loading: false,
                error: null,
                data: copyMerge(state.data, action.payload.data)
            });
        }
        case GET_PATCH + FAIL:
            if (isCancelled(action))
                return copyMerge(state, {loading: false});
            if (action.error.response.status === 404)
                return copyMerge(state, {loading: false, error: "Patch not found"});
            return copyMerge(state, {loading: false, error: action.error.message});
        default:
            return state;
    }
}