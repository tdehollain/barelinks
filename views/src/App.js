import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { store } from './store';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';

import TopBarContainer from './components/TopBarContainer';
import HomeView from './components/HomeView';
import TagsViewContainer from './components/TagsViewContainer';
import SearchViewContainer from './components/SearchViewContainer';
import AddTagModalContainer from './components/AddTagModalContainer';
import AuthContainer from './components/auth/AuthContainer.jsx';
import PrivateRoute from './components/PrivateRoute';

import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);

class App extends Component {

  constructor() {
    super();

    this.state = {
      isAuthenticated: false,
      username: ''
    }
  }

  componentDidMount() {
    this.authenticate();
  }

  authenticate() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState({ isAuthenticated: true, username: user.username });
        store.dispatch({
          type: 'UPDATE_USER',
          isAuthenticated: true,
          username: user.username
        });
      })
      .catch(err => {
        this.setState({ isAuthenticated: false, username: '' });
        console.log('No user authenticated');
      });
  }

  render() {
    return (
      <div className="App">
        <TopBarContainer
        />
        <Switch>
          <PrivateRoute exact path='/' component={HomeView} />
          <PrivateRoute path='/tags/' component={TagsViewContainer} />
          <PrivateRoute path='/search/' component={SearchViewContainer} />
          <Route path='/login/' component={AuthContainer} />
          <Route path='/signup/' component={AuthContainer} />
          <Route path='/forgotpassword/' component={AuthContainer} />
          <Route path='/verificationsent/' component={AuthContainer} />
        </Switch>
        <AddTagModalContainer />
      </div>
    );
  }
}

export default App;