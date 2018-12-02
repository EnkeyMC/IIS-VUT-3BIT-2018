import {buildQuery} from "./index";

export const GET_PATCHES = 'GET_PATCHES_REQ';
export const GET_PATCH = 'GET_PATCH_REQ';
export const SET_PATCH_ERROR = 'SET_PATCH_ERROR';

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

export function getPatch(id) {
    return {
        type: GET_PATCH,
        payload: {
            request: {
                url: '/api/patches/'+id
            }
        }
    }
}

export function setPatchError(msg) {
    return {
        type: SET_PATCH_ERROR,
        msg: msg
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