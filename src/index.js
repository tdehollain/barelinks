import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from './helpers/history/history';
import { Provider } from 'react-redux';
import { Auth0Provider } from './Auth/react-auth0-spa';
import config from './Auth/auth_config.json';
import { store } from './helpers/store';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  window.history.replaceState({}, document.title, appState && appState.targetUrl ? appState.targetUrl : window.location.pathname);
};

const stage = process.env.REACT_APP_STAGE || 'dev';

ReactDOM.render(
  <Auth0Provider
    domain={config[stage].domain}
    client_id={config[stage].clientId}
    redirect_uri={window.location.origin}
    audience={config[stage].audience}
    onRedirectCallback={onRedirectCallback}
  >
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </Auth0Provider>,
  document.getElementById('root')
);
registerServiceWorker();
