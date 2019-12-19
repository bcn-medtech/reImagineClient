import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { DragAndDropPage } from './Pages/DragAndDropPage';
import  InstallersPage from './Pages/InstallersPage';
import { PlPageLogin } from './Pages/LogInPage';

class App extends Component {

  render() {
    return (
      <Router>
        <Route exact path="/" component={DragAndDropPage} />
        <Route exact path="/Anonimizer" component={DragAndDropPage} />
        <Route exact path="/installers" component={InstallersPage} />
        <Route exact path="/LogIn" component={PlPageLogin} />
      </Router>
    );
  }
}

export default App;
