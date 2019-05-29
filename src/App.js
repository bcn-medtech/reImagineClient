import React, { Component } from 'react';
//import { BrowserRouter as Router, Route } from 'react-router-dom';
import {DDPage} from './Pages/DDPage/DD_Page';
const { ipcRenderer } = window.require("electron");



class App extends Component {

  render() {
    return (
        <div>
          <DDPage/>
        </div>
    );
  }
}

export default App;
