import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from './helpers/history/history';
import { Provider } from 'react-redux';
import { store } from './helpers/store';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<App />
		</Router>
	</Provider>
	, document.getElementById('root'));
registerServiceWorker();