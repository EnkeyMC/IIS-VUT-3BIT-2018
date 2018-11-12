import 'babel-polyfill';
import './utils/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { zeroBugsApp } from './reducers';
import { Provider } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

export const client = axios.create();

const axiosMiddlewareConfig = {
    interceptors: {
        request: [
            (context, config) => {
                if (context.getState().global.token) {
                    config.headers['Authorization'] = 'Token ' + context.getState().global.token;
                }

                return config;
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
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
    ), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
