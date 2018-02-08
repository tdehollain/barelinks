import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import TopBarContainer from './components/TopBarContainer';
import HomeView from './components/HomeView';
// import TagsView from './components/TagsView';
// import SearchView from './components/SearchView';
import AddTagModalContainer from './components/AddTagModalContainer'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';

export default class App extends Component {

  render() {
    return (
      <div className="App">
        <TopBarContainer />
        <Switch>
          <Route exact path='/' component={HomeView} />
        </Switch>
        <AddTagModalContainer />
      </div>
    );
  }
}