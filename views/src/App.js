import React, { Component } from 'react';
import UserBar from './UserBar';
import MainView from './MainView';
// import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <UserBar username="Thib"/>
        <MainView />
      </div>
    );
  }
}

export default App;
