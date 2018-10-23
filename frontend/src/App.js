import React, { Component } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCheckCircle,
    faBoxOpen,
    faUser} from '@fortawesome/free-solid-svg-icons';
library.add(faCheckCircle, faBoxOpen, faUser);

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
