import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { DragAndDropPage } from './pages/DragAndDropPage/DragAndDropPage';
import InstallersPage from './pages/InstallersPage/InstallersPage';
import { InitialPage } from './pages/InitialPage/InitialPage';
import { PlPageLogin } from './pages/LogInPage/LogInPage';
import './App.css';

//const { ipcRenderer } = window.require('electron');



class App extends Component {


  first_page() {
    let local = localStorage.getItem('started');
    if (local) return DragAndDropPage;
    else return InitialPage
  }


  render() {
    return (
      <Router>
        <Route path="/" exact component={this.first_page()} />
        <Route path="/Anonimizer" component={DragAndDropPage} />
        <Route path="/installers/" component={InstallersPage} />
        <Route path="/LogIn" component={PlPageLogin} />
      </Router>
    );
  }
}

export default App;
