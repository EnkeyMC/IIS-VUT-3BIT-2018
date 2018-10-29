
export const TOGGLE_NAVBAR = 'TOGGLE_NAVBAR';
export const GET_DATA = 'GET_DATA_REQ';

export function toggleNavbar() {
    return {type: TOGGLE_NAVBAR};
}

export function loadData() {
    return {
        type: GET_DATA,
        payload: {
            request: {
                url: '/api/tickets'
            }
        }
    };
}
