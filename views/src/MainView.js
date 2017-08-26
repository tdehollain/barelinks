import React, { Component } from 'react';

import MainForm from './MainForm';
import LinksList from './LinksList';
import { URLisValid, immutableDelete } from './Utils.js';

class MainView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			"enteredURL": "",
			"links": []
		};

		this.handleURLchange = this.handleURLchange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleURLchange(e) {
		this.setState({ 
			"enteredURL": e.target.value
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		if(URLisValid(this.state.enteredURL)) {
			this.setState({
				"links": [{
					"url": this.state.enteredURL,
					"title": this.state.enteredURL,
					"date": new Date()
				},...this.state.links]
			});
		}

		// empty form
		this.setState({
			"enteredURL": ""
		});

		fetch("/api/add/Thib/" + encodeURIComponent(this.state.enteredURL) + '/' + new Date(), {
			"method": "POST",
			"headers": {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		})
		.then((res) => res.json())
		.then(res => {

			let currentLinks = this.state.links;

			let newLink = {
				date: currentLinks[0].date,
				url: currentLinks[0].url,
				title: res.title
			}

			let newLinks = [newLink, ...currentLinks.slice(1)]

			this.setState({
				"links": newLinks
			});

		});
	}

	handleRemove(item, id) {
		fetch('/api/delete/Thib/' + id, {
				"method": "DELETE",
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			})
		.then((res) => res.json());

		this.setState({ 
			"links": immutableDelete(this.state.links, item)
		});
	}

	componentDidMount() {
		fetch('/api/get/Thib/1/50')
			.then(res => res.json())
			.then(links => {
				this.setState({ "links": links.list });
			});
		;
	}

	render() {
		return (
			<div className='MainView'>
				<MainForm
					URLvalue={this.state.enteredURL}
					handleURLchange={this.handleURLchange} 
					handleSubmit={this.handleSubmit}
				/>
				<LinksList 
					list={this.state.links}
					removeLink={this.handleRemove}
				/>
			</div>
		);
	}
}

export default MainView;