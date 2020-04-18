import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import './App.css';
import './../node_modules/foundation-apps/dist/css/foundation-apps.min.css';
//import  { UploaderPage }  from './Pages/UploaderPage';
//import  { InstallersPage }  from './Pages/InstallersPage';
import { createHashHistory } from "history";
import {RootPage} from "./Pages/root/root";

//const history = createBrowserHistory();
const history = createHashHistory();

class App extends Component {


  render() {
    /*
    return (
      <Router history={history}>
        <Route exact path="/LogIn" component={PlPageLogin} />
        <Route exact path="/Settings" component={SettingsPage} />
        <Route exact path="/Installers" component={InstallersPage} requiredPrograms={this.props.config.requiredPrograms}/>
      </Router>
    );
    */
   return (
    <Router history={history}>
      <Route exact path="/" component={RootPage} />
    </Router>
  );   
  }
}

export default App;
