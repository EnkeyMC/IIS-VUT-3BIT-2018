export const GET_SEVERITIES = 'GET_SEVERITIES_REQ';

export function getSeverities() {
    return {
        type: GET_SEVERITIES,
        payload: {
            request: {
                url: '/api/severities/'
            }
        }
    }
}