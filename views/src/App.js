import React, { Component } from 'react';
import './App.css';
import TopBar from './Components/TopBar';
import MainView from './Components/MainView';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';

export default class App extends Component {

	render() {
		return (
			<div className="App">
				<TopBar username="Thib"/>
				<MainView />
			</div>
		);
	}
}