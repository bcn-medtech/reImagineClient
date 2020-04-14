import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const { ipcRenderer } = window.require("electron");

const config = ipcRenderer.sendSync("getConfig");
const rootElement = document.getElementById('root');
ReactDOM.render(<App config={config}/>, rootElement);
registerServiceWorker();
