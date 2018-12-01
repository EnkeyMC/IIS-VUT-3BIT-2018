import React, { Component } from 'react';
import {ErrorBoundary, Spinner} from './utils';
import { library } from '@fortawesome/fontawesome-svg-core';
import {Redirect, Route, Switch} from "react-router";
import RegisterView from "./views/RegisterView";
import TicketView from "./views/TicketView";
import LoginView from "./views/LoginView";
import ProfileView from "./views/ProfileView";
import ErrorView from "./views/ErrorView";
import BugView from "./views/BugView";
import ModuleView from "./views/ModuleView";
import UsersView from "./views/UsersView";
import {
    faReceipt,
    faUser,
    faAngleUp,
    faAngleDown,
    faEnvelope,
    faBirthdayCake,
    faLaptopCode,
    faCalendarAlt,
    faClock,
    faSpinner,
    faEdit,
    faBug,
    faClone,
    faPlus,
    faExclamationCircle,
    faSearch,
    faBandAid,
    faUsers,
    faSignInAlt,
    faUserTie,
    faMarker
} from '@fortawesome/free-solid-svg-icons';
import {
    faSquare,
    faCheckSquare
} from '@fortawesome/free-regular-svg-icons';
import {Provider} from "react-alert";
import AlertTemplate from 'react-alert-template-basic';
import {connect} from "react-redux";
import {verifyUser} from "./actions/global";
import PatchesView from "./views/PatchesView";
import {RestrictedRoute, ROLE_SUPERVISOR} from "./components/RoleRestriction";

library.add(
    faReceipt, faUser, faAngleUp, faAngleDown, faEnvelope,
    faBirthdayCake, faLaptopCode, faCalendarAlt, faClock, faSpinner,
    faEdit, faBug, faClone, faPlus, faExclamationCircle, faSearch,
    faCheckSquare, faSquare, faBandAid, faUsers, faSignInAlt, faUserTie,
    faMarker
);

const alertConfig = {
    timeout: 3000,
    offset: '50px',
    transition: 'scale',
    zIndex: 9999
};

const UserVerificator = connect(
    state => {
        return {
            verifyingUser: state.global.verifyingUser && state.global.token !== null
        }
    },
    dispatch => {
        return {
            verifyUser: () => dispatch(verifyUser())
        }
    }
)(class UserVerificatorCls extends React.Component{
    constructor(props) {
        super(props);

        this.props.verifyUser();
    }

    render() {
        if (this.props.verifyingUser) {
            return (
                <div className="h-100 flex-mid">
                    <Spinner size="5x" />
                </div>
            );
        }
        return this.props.children;
    }
});

export default class App extends Component {
  render() {
    return (
      <ErrorBoundary>
          <UserVerificator>
              <Provider template={AlertTemplate} {...alertConfig} >
                  <Switch>
                      <Redirect exact from="/" to="/tickets/all" />
                      <Redirect exact from="/tickets" to="/tickets/all"/>
                      <Route path="/tickets/:status(all|new|assigned|closed|my)" component={TicketView} />
                      <Route path="/login" component={LoginView} />
                      <Route path="/register" component={RegisterView} />
                      <Route path="/profile" component={ProfileView}/>
                      <Route path="/no-permission" render={props => <ErrorView {...props} error="403"/>}/>
                      <Route path="/bugs" component={BugView}/>
                      <Route path="/modules" component={ModuleView} />
                      <Redirect exact from="/patches" to="/patches/all" />
                      <Route path="/patches/:status(all|my|in-progress|awaiting-approval|approved|released)" component={PatchesView}/>
                      <RestrictedRoute minRole={ROLE_SUPERVISOR} path="/users" component={UsersView} />
                      <Route render={props => <ErrorView {...props} error="404" />} />
                  </Switch>
              </Provider>
          </UserVerificator>
      </ErrorBoundary>
    );
  }
}
