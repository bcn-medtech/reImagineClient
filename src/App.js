import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { HomePage } from './Pages/HomePage';
import { UploaderPage } from './Pages/UploaderPage';
import { SettingsPage } from './Pages/SettingsPage';
import { DragAndDropPage } from './Pages/DragAndDropPage';
import  InstallersPage from './Pages/InstallersPage';
import { PlPageLogin } from './Pages/LogInPage';

class App extends Component {

  render() {
    return (
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/Anonimizer" component={DragAndDropPage} />
        <Route exact path="/Uploader" component={UploaderPage} />
        <Route exact path="/installers" component={InstallersPage} />
        <Route exact path="/LogIn" component={PlPageLogin} />
        <Route exact path="/Settings" component={SettingsPage} />
      </Router>
    );
  }
}

export default App;
