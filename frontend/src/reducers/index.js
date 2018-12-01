import {GET_PATCHES} from '../actions/patches'
import {combineReducers} from "redux";
import {createBrowserHistory} from 'history';
import {connectRouter} from 'connected-react-router';
import {reduceGlobal} from "./global";
import {reduceTicketView} from "./ticketView";
import {reduceUserView} from "./userView";
import {reduceBugView} from "./bugView";
import {reduceModule, reduceModules} from "./modules";
import {createListReducer} from "./helpers";
import {GET_USERS} from "../actions/users";
import {GET_LANGUAGES} from "../actions/languages";
import {GET_SEVERITIES} from "../actions/severities";

export const history = createBrowserHistory();

export const zeroBugsApp = combineReducers({
    router: connectRouter(history),
    global: reduceGlobal,
    ticketView: reduceTicketView,
    profileView: reduceUserView,
    languages: createListReducer(GET_LANGUAGES),
    bugView: reduceBugView,
    severities: createListReducer(GET_SEVERITIES),
    modules: reduceModules,
    users: createListReducer(GET_USERS),
    module: reduceModule,
    patches: createListReducer(GET_PATCHES)
});

