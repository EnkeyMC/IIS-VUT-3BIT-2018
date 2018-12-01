import {CLEAR} from "./index";

export const GET_MODULES = 'GET_MODULES_REQ';
export const GET_MODULE_BUG = 'GET_MODULE_BUG_REQ';
export const GET_MODULE = 'GET_MODULE_REQ';

export function getModules() {
    return {
        type: GET_MODULES,
        payload: {
            request: {
                url: '/api/modules/'
            }
        }
    }
}

export function getModuleBug(id) {
    return {
        type: GET_MODULE_BUG,
        payload: {
            request: {
                url: '/api/bugs/' + id
            }
        }
    }
}

export function clearModuleBugs() {
    return {
        type: GET_MODULE_BUG + CLEAR
    }
}

export function getModule(id) {
    return {
        type: GET_MODULE,
        payload: {
            request: {
                url: '/api/modules/' + id
            }
        }
    }
}