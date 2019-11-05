import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import NavBarContainer from './NavBar/NavBarContainer';
import HomePage from './HomePage/HomePage';
import TagsPage from './TagsPage/TagsPage';
import SearchPage from './SearchPage/SearchPage';

import { useAuth0 } from './Auth/react-auth0-spa';

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  return (
    <div className="App">
      <NavBarContainer isAuthenticated={isAuthenticated} user={user} />
      {isAuthenticated && user && (
        <Switch>
          <Route exact path="/">
            <HomePage username={user.email} />
          </Route>
          <Route path="/tags/" render={props => <TagsPage {...props} username={user.email} />} />
          <Route path="/search/" render={props => <SearchPage {...props} username={user.email} />} />
        </Switch>
      )}
    </div>
  );
};

export default App;
