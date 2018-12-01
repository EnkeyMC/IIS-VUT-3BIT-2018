import {FAIL, SUCC} from "../actions";
import {copyMerge} from "../utils";
import {isCancelled} from "./helpers";
import {initialSingleToListState, initialState, reduceGetList, reduceSingleToList} from "./helpers";
import {GET_MODULE, GET_MODULE_BUG, GET_MODULES} from "../actions/modules";

const initialModulesState = Object.assign(
    initialState,
    {moduleBugs: initialSingleToListState}
);

export function reduceModules(state = initialModulesState, action) {
    return copyMerge(
        reduceGetList(state, action, GET_MODULES),
        {moduleBugs: reduceSingleToList(state.moduleBugs, action, GET_MODULE_BUG)}
    )
}

export function reduceModule(state = initialState, action) {
    switch (action.type) {
        case GET_MODULE:
            return copyMerge(state, {loading: true, error: null, data: null});
        case GET_MODULE + SUCC: {
            return copyMerge(state, {
                loading: false,
                error: null,
                data: copyMerge(state.data, action.payload.data)
            });
        }
        case GET_MODULE + FAIL:
            if (isCancelled(action))
                return copyMerge(state, {loading: false});
            if (action.error.response.status === 404)
                return copyMerge(state, {loading: false, error: "Module not found"});
            return copyMerge(state, {loading: false, error: action.error.message});
        default:
            return state;
    }
}