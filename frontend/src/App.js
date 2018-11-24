import React, { Component } from 'react';
import {ErrorBoundary, Spinner} from './utils';
import { library } from '@fortawesome/fontawesome-svg-core';
import {Redirect, Route, Switch} from "react-router";
import RegisterView from "./views/RegisterView";
import TicketView from "./views/TicketView";
import LoginView from "./views/LoginView";
import ProfileView from "./views/ProfileView";
import ErrorView from "./views/ErrorView";
import {
    faBoxes,
    faBox,
    faBoxOpen,
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
    faPeopleCarry,
    faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import {Provider} from "react-alert";
import AlertTemplate from 'react-alert-template-basic';
import {RestrictedRoute, ROLE_USER} from "./components/RoleRestriction";
import {connect} from "react-redux";
import {verifyUser} from "./actions";
import BugView from "./views/BugView";

library.add(
    faBoxes, faBox, faBoxOpen, faUser, faAngleUp, faAngleDown, faEnvelope,
    faBirthdayCake, faLaptopCode, faCalendarAlt, faClock, faSpinner,
    faEdit, faBug, faClone, faPlus, faExclamationCircle, faPeopleCarry
);

const alertConfig = {
    timeout: 4000,
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
                      <Route path="/tickets/all" component={TicketView} />
                      <Route path="/tickets/new" component={TicketView} />
                      <Route path="/tickets/assigned" component={TicketView} />
                      <Route path="/tickets/closed" component={TicketView} />
                      <RestrictedRoute path="/tickets/my" minRole={ROLE_USER} component={TicketView} />
                      <Route path="/login" component={LoginView} />
                      <Route path="/register" component={RegisterView} />
                      <Route path="/profile" component={ProfileView}/>
                      <Route path="/no-permission" component={ErrorView}/>
                      <Route path="/bugs" component={BugView}/>
                  </Switch>
              </Provider>
          </UserVerificator>
      </ErrorBoundary>
    );
  }
}
