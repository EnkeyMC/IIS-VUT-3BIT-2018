export const SUBMIT_FORM = 'SUBMIT_FORM_REQ';

export const SUCC = '_SUCCESS';
export const FAIL = '_FAIL';
export const REQ = '_REQ';
export const CLEAR = '_CLEAR';

export function buildQuery(query = null) {
    if (!query)
        return '';

    let q = '?';
    for (const key in query) {
        if (query.hasOwnProperty(key)) {
            if (Array.isArray(query[key])) {
                for (const i in query[key]) {
                    if (query[key].hasOwnProperty(i))
                        q += key+'='+encodeURIComponent(query[key][i])+'&';
                }
            } else {
                q += key+'='+encodeURIComponent(query[key])+'&';
            }
        }
    }
    return q;
}

export function submitForm(id, url, data, edit) {
    return {
        type: SUBMIT_FORM,
        id: id,
        payload: {
            request: {
                method: edit ? "patch" : "post",
                url: url,
                data: data
            }
        }
    }
}

