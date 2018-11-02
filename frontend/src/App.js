import React, { Component } from 'react';
import {ErrorBoundary} from './utils';
import { library } from '@fortawesome/fontawesome-svg-core';
import {Route, Switch} from "react-router";
import RegisterView from "./views/RegisterView";
import TicketView from "./views/TicketView";
import LoginView from "./views/LoginView";
import {
    faCheckCircle,
    faBoxOpen,
    faUser,
    faAngleLeft,
    faAngleRight
} from '@fortawesome/free-solid-svg-icons';
library.add(faCheckCircle, faBoxOpen, faUser, faAngleRight, faAngleLeft);

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
          <Switch>
              <Route exact path="/" component={TicketView} />
              <Route path="/login" component={LoginView} />
              <Route path="/register" component={RegisterView} />
          </Switch>
      </ErrorBoundary>
    );
  }
}

export default App;
