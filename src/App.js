import React, { Component } from 'react';
import { DragAndDropPage } from './pages/DragAndDropPage/DragAndDropPage';
import logo from './logo.svg';
import './App.css';

//const { ipcRenderer } = window.require('electron');



class App extends Component {

  render() {
    return (
        <div>
          <DragAndDropPage/>
        </div>
    );
  }
}

export default App;
