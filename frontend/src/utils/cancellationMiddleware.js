import axios from 'axios';
import {CANCEL_ACTION_REQUESTS, CANCEL_DATA} from "../actions";

// Code from this file is based on code from this web page https://gist.github.com/alexeychikk/2078366d8fc975922294ae6210648a0f

const cancelRequest = token => {
    token.cancel(CANCEL_DATA);
    token.onCancelCallback && token.onCancelCallback();
};

export function createCancellationMiddleware() {
    return store => {
        let tokensMap = {};

        return next => action => {
            const { actionType, payload, type } = action;

            if (type.endsWith('_REQ')) {
                const actionTypeRequest = type;
                const source = axios.CancelToken.source();
                source.onCancelCallback = payload.request.onCancel;

                // Extend action so that redux-axios-middleware
                // can understand that request is cancellable.
                const cancelableAction = {
                    ...action,
                    payload: {
                        ...payload,
                        request: {
                            ...payload.request,
                            cancelToken: source.token
                        }
                    }
                };

                // Store cancellation token so that we can cancel it
                // later using actions.js in this folder.
                const actionTokens = tokensMap[actionTypeRequest] || [];
                actionTokens.push(source);
                tokensMap[actionTypeRequest] = actionTokens;

                return next(cancelableAction);
            }

            // Listen for cancel actions and cancel requests appropriately.
            if (type === CANCEL_ACTION_REQUESTS) {
                const actionTypes = Array.isArray(actionType)
                    ? actionType
                    : [actionType];

                actionTypes.forEach(actionType => {
                    const actionTokens = tokensMap[actionType];
                    if (actionTokens) {
                        actionTokens.forEach(cancelRequest);
                        tokensMap[actionType] = [];
                    }
                });
            }

            return next(action);
        };
    };
}