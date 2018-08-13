import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import NavBarContainer from './NavBar/NavBarContainer';
import HomePage from './HomePage/HomePage';
import AuthContainer from './Auth/AuthContainer.jsx';
import AddTagModalContainer from "./HomePage/AddTagModal/AddTagModalContainer";
import { PrivateRoute } from './Components/PrivateRoute';

import Amplify from 'aws-amplify';
import awsConfig from './utils/awsConfig';

Amplify.configure(awsConfig.cognitoConfig);

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBarContainer />
        <Switch>
          <PrivateRoute exact path='/' component={HomePage} />
          <PrivateRoute path='/link1/' component={HomePage} />
          <PrivateRoute path='/link2/' component={HomePage} />
          <Route path='/login/' component={AuthContainer} />
          <Route path='/signup/' component={AuthContainer} />
          <PrivateRoute path='/changepassword/' component={AuthContainer} />
          <PrivateRoute path='/passwordchanged/' component={AuthContainer} />
          <Route path='/forgotpassword/' component={AuthContainer} />
          <Route path='/resetpassword/' component={AuthContainer} />
          <Route path='/verificationsent/' component={AuthContainer} />
        </Switch>
        <AddTagModalContainer />
      </div>
    );
  }
}

export default App;
