import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import TopBar from './Component/TopBar';
import MainView from './Component/MainView';
import TagsView from './Component/TagsView';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';

export default class App extends Component {

	constructor() {
		super();

		this.state = {
			tagColors: [
				'#B0BEC5',
				'#BCAAA4',
				'#FFCC80',
				'#FFF59D',
				'#C5E1A5',
				'#80CBC4',
				'#81D4FA',
				'#9FA8DA',
				'#CE93D8',
				'#EF9A9A'
			]
		};
	}

	render() {
		return (
			<div className="App">
				<TopBar username="Thib"/>
				<Switch>
					<Route exact path='/' render={(props) => (
						<MainView maxTags={3} tagColors={this.state.tagColors} />
					)}/>
					<Route path='/tags' component={TagsView} />
				</Switch>
			</div>
		);
	}
}