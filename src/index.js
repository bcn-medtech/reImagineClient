import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import './../node_modules/foundation-sites/dist/css/';
import './../node_modules/foundation-apps/dist/css/foundation-apps.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
