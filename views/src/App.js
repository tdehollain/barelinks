import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import TopBarContainer from './components/TopBarContainer';
import HomeView from './components/HomeView';
import TagsViewContainer from './components/TagsViewContainer';
import SearchViewContainer from './components/SearchViewContainer';
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
          <Route path='/tags/' component={TagsViewContainer} />
          <Route path='/search/' component={SearchViewContainer} />
        </Switch>
        <AddTagModalContainer />
      </div>
    );
  }
}