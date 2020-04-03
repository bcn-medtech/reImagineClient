import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import config from "./conf/config"

const rootElement = document.getElementById('root');
ReactDOM.render(<App config={config}/>, rootElement);
registerServiceWorker();
