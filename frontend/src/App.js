import React, { Component } from 'react';
import {ErrorBoundary} from './utils';
import { library } from '@fortawesome/fontawesome-svg-core';
import {Redirect, Route, Switch} from "react-router";
import RegisterView from "./views/RegisterView";
import TicketView from "./views/TicketView";
import LoginView from "./views/LoginView";
import ProfileView from "./views/ProfileView";
import {
    faCheckCircle,
    faBoxOpen,
    faUser,
    faAngleUp,
    faAngleDown,
    faEnvelope,
    faBirthdayCake,
    faLaptopCode,
    faCalendarAlt,
    faClock
} from '@fortawesome/free-solid-svg-icons';
library.add(
    faCheckCircle, faBoxOpen, faUser, faAngleUp, faAngleDown, faEnvelope,
    faBirthdayCake, faLaptopCode, faCalendarAlt, faClock
);

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
          <Switch>
              <Redirect exact from="/" to="/ticket" />
              <Route path="/ticket" component={TicketView} />
              <Route path="/login" component={LoginView} />
              <Route path="/register" component={RegisterView} />
              <Route path="/profile" component={ProfileView}/>
          </Switch>
      </ErrorBoundary>
    );
  }
}

export default App;
