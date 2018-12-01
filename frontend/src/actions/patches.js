import {buildQuery} from "./index";

export const GET_PATCHES = 'GET_PATCHES_REQ';

export function getPatches(query = null) {
    return {
        type: GET_PATCHES,
        payload: {
            request: {
                url: '/api/patches' + buildQuery(query)
            }
        }
    }
}

export function getFilteredPatches(filter, username) {
    if (filter === 'all') {
        return getPatches();
    } else if (filter === 'my') {
        return getPatches({username: username});
    }
    return getPatches({status: filter});
}