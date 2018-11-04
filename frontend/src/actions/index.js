export const TOGGLE_NAVBAR = 'TOGGLE_NAVBAR';
export const GET_TICKETS = 'GET_TICKETS_REQ';
export const SUBMIT_FORM = 'SUBMIT_FORM';

export function toggleNavbar() {
    return {type: TOGGLE_NAVBAR};
}

export function getTickets() {
    return {
        type: GET_TICKETS,
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
