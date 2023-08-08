import './styles.scss';
import 'bootstrap';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './slices/index'
import { io } from "socket.io-client";

const socket = io();

socket.on('newMessage', (payload) => {
  console.log(payload); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
});

const root = ReactDOM.createRoot(document.getElementById('chat'));
root.render(
    <Provider store={store}> 
      <App />
    </Provider> 
);

// <Provider store={store}>  
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
