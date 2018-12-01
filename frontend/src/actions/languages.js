export const GET_LANGUAGES = 'GET_LANGUAGES_REQ';

export function getLanguages() {
    return {
        type: GET_LANGUAGES,
        payload: {
            request: {
                url: '/api/languages'
            }
        }
    }
}