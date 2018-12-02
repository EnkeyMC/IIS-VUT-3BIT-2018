import {FAIL, SUCC} from "../actions";
import {copyMerge} from "../utils";
import {isCancelled} from "./helpers";
import {initialSingleToListState, initialState, reduceGetList, reduceSingleToList} from "./helpers";
import {GET_BUG, GET_BUG_TICKET, GET_BUGS, SET_BUG, SET_BUG_ERROR} from "../actions/bugs";

const initialBugsViewState = {
    bugs: initialState,
    bugInfo: copyMerge(initialState,
        {bugTickets: initialSingleToListState})
};

export function reduceBugView(state = initialBugsViewState, action) {
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
        case GET_BUG + SUCC: {
            return copyMerge(state, {
                loading: false,
                error: null,
                data: copyMerge(state.data, action.payload.data)
            });
        }
        case GET_BUG + FAIL:
            if (isCancelled(action))
                return copyMerge(state, {loading: false});
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