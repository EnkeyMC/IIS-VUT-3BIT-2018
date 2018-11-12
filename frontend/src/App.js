import React, { Component } from 'react';
import {ErrorBoundary} from './utils';
import { library } from '@fortawesome/fontawesome-svg-core';
import {Redirect, Route, Switch} from "react-router";
import RegisterView from "./views/RegisterView";
import TicketView from "./views/TicketView";
import LoginView from "./views/LoginView";
import {
    faCheckCircle,
    faBoxOpen,
    faUser,
    faAngleUp,
    faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import {Provider} from "react-alert";
import AlertTemplate from 'react-alert-template-basic';
library.add(faCheckCircle, faBoxOpen, faUser, faAngleUp, faAngleDown);

const alertConfig = {
    timeout: 4000,
    offset: '50px',
    transition: 'scale',
    zIndex: 9999
};

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
          <Provider template={AlertTemplate} {...alertConfig} >
              <Switch>
                  <Redirect exact from="/" to="/ticket" />
                  <Route path="/ticket" component={TicketView} />
                  <Route path="/login" component={LoginView} />
                  <Route path="/register" component={RegisterView} />
              </Switch>
          </Provider>
      </ErrorBoundary>
    );
  }
}

export default App;
