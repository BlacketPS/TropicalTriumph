import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './comps/App.jsx';
import './styles/all.scss';
import { Provider } from 'react-redux';
import store from './redux/store.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App/>
    </Provider>
)