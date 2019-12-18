import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { DragAndDropPage } from './Pages/DragAndDropPage';
import  InstallersPage from './Pages/InstallersPage';
import { PlPageLogin } from './Pages/LogInPage';

class App extends Component {

  render() {
    return (
      <Router>
        <Route path="/" component={DragAndDropPage} />
        <Route path="/Anonimizer" component={DragAndDropPage} />
        <Route path="/installers" component={InstallersPage} />
        <Route path="/LogIn" component={PlPageLogin} />
      </Router>
    );
  }
}

export default App;
