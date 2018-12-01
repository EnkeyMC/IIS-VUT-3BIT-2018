export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';
export const LOGOUT = 'LOGOUT_REQ';
export const VERIFY_USER = 'VERIFY_USER_REQ';
export const CANCEL_ACTION_REQUESTS = 'CANCEL_ACTION_REQUEST';
export const CANCEL_DATA = {cancelled: true};

export function cancelActionRequests(actionType) {
    return {type: CANCEL_ACTION_REQUESTS, actionType: actionType};
}

export function verifyUser() {
    return {
        type: VERIFY_USER,
        payload: {
            request: {
                url: '/auth/logged_in'
            }
        }
    }
}

export function setToken(token) {
    return {
        type: SET_TOKEN,
        token: token
    }
}

export function setUser(user) {
    return {
        type: SET_USER,
        user: user
    }
}

export function logout() {
    return {
        type: LOGOUT,
        payload: {
            request: {
                method: "post",
                url: "/auth/logout/"
            }
        }
    }
}