import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { DragAndDropPage } from './pages/DragAndDropPage/DragAndDropPage';
import { InstallersPage } from './pages/InstallersPage/InstallersPage';
import './App.css';

//const { ipcRenderer } = window.require('electron');



class App extends Component {

  render() {
    return (
      <Router>
        <Route path="/" exact component={DragAndDropPage}/>
        <Route path="/installers/" component={InstallersPage}/>
      </Router>
    );
  }
}

export default App;
