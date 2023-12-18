/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import 'react-toastify/dist/ReactToastify.css';
import './style/style-header.css';
import './style/style-graph.css';
import './style/style-alert.css';
import './style/style-target.css';
import './style/style-error.css';
import './style/style-dashboard.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
