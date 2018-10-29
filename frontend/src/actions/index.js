
export const TOGGLE_NAVBAR = 'TOGGLE_NAVBAR';
export const GET_DATA = 'GET_DATA_REQ';
export const SUBMIT_FORM = 'SUBMIT_FORM';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

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

export function submitForm(id, event) {
    return {
        type: SUBMIT_FORM
    }
}

export function handleChange(id, event) {
    return {
        type: HANDLE_CHANGE,
        field: event.target.name,
        value: event.target.value
    }
}
