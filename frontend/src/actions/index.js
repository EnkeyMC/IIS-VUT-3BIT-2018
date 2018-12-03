export const SUBMIT_FORM = 'SUBMIT_FORM_REQ';
export const DELETE = 'DELETE_REQ';

export const SUCC = '_SUCCESS';
export const FAIL = '_FAIL';
export const REQ = '_REQ';
export const CLEAR = '_CLEAR';

function getValue(val) {
    if (val === true)
        return "true";
    if (val === false)
        return "false";
    return encodeURIComponent(val);
}

export function buildQuery(query = null) {
    if (!query)
        return '';

    let q = '?';
    for (const key in query) {
        if (query.hasOwnProperty(key)) {
            if (Array.isArray(query[key])) {
                for (const i in query[key]) {
                    if (query[key].hasOwnProperty(i))
                        q += key+'='+getValue(query[key][i])+'&';
                }
            } else {
                q += key+'='+getValue(query[key])+'&';
            }
        }
    }
    return q;
}

export function submitForm(id, url, data, method) {
    return {
        type: SUBMIT_FORM,
        id: id,
        payload: {
            request: {
                method: method,
                url: url,
                data: data
            }
        }
    }
}

export function deleteItem(url) {
    return {
        type: DELETE,
        payload: {
            request: {
                url: url,
                method: 'delete'
            }
        }
    }
}
