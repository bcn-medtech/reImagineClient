import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import './App.css';
import  { UploaderPage }  from './Pages/UploaderPage';
import  { InstallersPage }  from './Pages/InstallersPage';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

class App extends Component {

  render() {
    /*
    return (
      <Router history={history}>
        <Route exact path="/LogIn" component={PlPageLogin} />
        <Route exact path="/Settings" component={SettingsPage} />
      </Router>
    );
    */
   return (
    <Router history={history}>
      <Route exact path="/" component={UploaderPage} />
      <Route exact path="/Installers" component={InstallersPage} />
    </Router>
  );   
  }
}

export default App;
