import 'babel-polyfill';
import './utils/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router'
import './stylesheets/App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import {history, zeroBugsApp} from './reducers';
import { Provider } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {setToken, setUser} from "./actions";

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
                    if (response.response.status === 401) {
                        if (store.getState().global.token !== null) {
                            store.dispatch(setToken(null));
                            store.dispatch(setUser(null));
                            // Retry the action
                            store.dispatch(response.config.reduxSourceAction);
                        }
                    }

                    return Promise.reject(response);
                }
            }
        ]
    }
};

const store = createStore(
    zeroBugsApp,
    applyMiddleware(axiosMiddleware(client, axiosMiddlewareConfig)),
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
