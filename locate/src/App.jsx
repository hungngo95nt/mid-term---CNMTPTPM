import React, { Component,PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Drawer, Toolbar } from 'react-md';
import Routing from './components/Routing'

class App extends Component {
  render() {
    return (
      <div>
      <Routing />
      </div>
    );
  }
}

export default App;
