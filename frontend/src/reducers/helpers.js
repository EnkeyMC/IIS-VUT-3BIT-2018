import {copyMerge} from "../utils";
import {FAIL, SUCC} from "../actions";
import {CLEAR} from "../actions/index";

export function isCancelled(action) {
    return action.error && action.error.data && action.error.data.cancelled;
}

export const initialState = {
    loading: false,
    error: null,
    data: null
};
export const initialSingleToListState = {
    loading: 0,
    error: null,
    data: []
};

export function createListReducer(ACTION) {
    return (state = initialState, action) => {
        return reduceGetList(state, action, ACTION);
    }
}

export function createSingleToListReducer(ACTION) {
    return (state = initialSingleToListState, action) => {
        return reduceSingleToList(state, action, ACTION);
    }
}

export function reduceGetList(state, action, ACTION) {
    switch (action.type) {
        case ACTION:
            return copyMerge(state, {
                loading: true,
                data: null,
                error: null
            });
        case ACTION + SUCC:
            return copyMerge(state, {
                loading: false,
                error: null,
                data: action.payload.data.results
            });
        case ACTION + FAIL:
            if (isCancelled(action))
                return copyMerge(state, {loading: false});
            return copyMerge(state, {
                loading: false,
                error: action.error.message
            });
        default:
            return state;
    }
}

export function reduceSingleToList(state, action, ACTION) {
    switch (action.type) {
        case ACTION:
            return copyMerge(state, {
                loading: state.loading + 1
            });
        case ACTION + SUCC:
            return copyMerge(state, {
                loading: state.loading - 1,
                data: state.data.concat([action.payload.data])
            });
        case ACTION + FAIL:
            if (isCancelled(action))
                return copyMerge(state, {loading: state.loading - 1});
            return copyMerge(state, {
                loading: state.loading - 1,
                error: state.error === null ? [action.error.message] : state.error.concat([action.error.message])
            });
        case ACTION + CLEAR:
            return copyMerge(state, {
                loading: 0,
                error: null,
                data: []
            });
        default:
            return state;
    }
}