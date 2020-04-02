import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import './App.css';
import  { UploaderPage }  from './Pages/UploaderPage';
import { createBrowserHistory } from "history";
import { withRouter } from 'react-router';

const history = createBrowserHistory();
//const HomePageWithRouter = withRouter(HomePage);
//const AnonimizerPageWithRouter = withRouter(AnonimizerPage);

class App extends Component {

  render() {
    /*
    return (
      <Router history={history}>
        <Route exact path="/" component={HomePageWithRouter} />
        <Route exact path="/Anonimizer" component={AnonimizerPageWithRouter} />
        <Route exact path="/Uploader" component={UploaderPage} />
        <Route exact path="/installers" component={InstallersPage} />
        <Route exact path="/LogIn" component={PlPageLogin} />
        <Route exact path="/Settings" component={SettingsPage} />
      </Router>
    );
    */
   return (
    <Router history={history}>
      <Route exact path="/" component={UploaderPage} />
    </Router>
  );   
  }
}

export default App;
