import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {DDPage} from './Pages/DDPage/DD_Page';
const { ipcRenderer } = window.require("electron");
//const { ipcRenderer } = require('electron');



class App extends Component {

  executeScript(){
    console.log("Execute script");

    /*const {spawn} = require('child_process');
      const proces = spawn('python',['/home/inigo/Escritorio/electron_boilerplate/tray/app/components/hello.py']);

      proces.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        //res.send(data.toString());
      });*/

      let Data = {
        message: "Hi",
        someData: "Let's go"
    };

    ipcRenderer.send('request-mainprocess-action', Data);
    ipcRenderer.send('execute-python','hello');
    
  }
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={DDPage}/>
        </div>
      </Router>
    );
  }
}

export default App;
