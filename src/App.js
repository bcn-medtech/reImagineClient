import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import './App.css';
import './../node_modules/foundation-apps/dist/css/foundation-apps.min.css';
import  { UploaderPage }  from './Pages/UploaderPage';
import  { InstallersPage }  from './Pages/InstallersPage';
import { createBrowserHistory } from "history";
import {RootPage} from "./Pages/root/root";

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
      <Route exact path="/" component={RootPage} />
      <Route exact path="/Installers" component={InstallersPage} requiredPrograms={this.props.config.requiredPrograms}/>
    </Router>
  );   
  }
}

export default App;
