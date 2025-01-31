import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router'
import 'bootstrap/dist/css/bootstrap.css';
import './stylesheets/App.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import {history, zeroBugsApp} from './reducers';
import { Provider } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {setToken} from "./actions/global";
import {createCancellationMiddleware} from './utils/cancellationMiddleware';
import {setUser} from "./actions/global";

export const client = axios.create();

const axiosMiddlewareConfig = {
    interceptors: {
        request: [
            (store, request) => {
                if (store.getState().global.token) {
                    request.headers['Authorization'] = 'Token ' + store.getState().global.token;
                }

                return request;
            }
        ],
        response: [
            {
                error: (store, response) => {
                    if (response.response && response.response.status === 401) {
                        if (!response.config.reduxSourceAction.noRetry) {
                            store.dispatch(setToken(null));
                            store.dispatch(setUser(null));
                            // Retry the action
                            store.dispatch({...response.config.reduxSourceAction, noRetry: true});
                        }
                    }

                    return Promise.reject(response);
                }
            }
        ]
    }
};

const loggerMiddleware = store => next => action => {
    console.group(action.type);
    console.info("Action", action);
    const result = next(action);
    console.log("Next state", store.getState());
    console.groupEnd();
    return result;
};

const store = createStore(
    zeroBugsApp,
    applyMiddleware(createCancellationMiddleware(), axiosMiddleware(client, axiosMiddlewareConfig), loggerMiddleware),
);

store.subscribe(() => {
    const token = store.getState().global.token;
    const user = store.getState().global.user;
    if (token)
        localStorage.setItem('AUTH_TOKEN', token);
    else
        localStorage.removeItem('AUTH_TOKEN');

    if (user)
        localStorage.setItem('AUTH_USER', JSON.stringify(user));
    else
        localStorage.removeItem('AUTH_USER');
});

ReactDOM.render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>
    ), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
