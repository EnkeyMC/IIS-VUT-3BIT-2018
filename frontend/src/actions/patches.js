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