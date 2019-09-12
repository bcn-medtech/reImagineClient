import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { DragAndDropPage } from './pages/DragAndDropPage/DragAndDropPage';
import InstallersPage from './pages/InstallersPage/InstallersPage';
import { InitialPage } from './pages/InitialPage/InitialPage';
import './App.css';

//const { ipcRenderer } = window.require('electron');



class App extends Component {


  render() {
    localStorage.clear();
    return (
      <Router>
        <Route path="/" exact component={InitialPage}/>
        <Route path="/Anonimizer" component={DragAndDropPage}/>
        <Route path="/installers/" component={InstallersPage}/>
      </Router>
    );
  }
}

export default App;
