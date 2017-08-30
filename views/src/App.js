import React, { Component } from 'react';
import './App.css'
import TopBar from './TopBar';
import MainView from './MainView';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';

class App extends Component {
	render() {
		return (
			<div className="App">
				<TopBar username="Thib"/>
				<MainView />
			</div>
		);
	}
}

export default App;
