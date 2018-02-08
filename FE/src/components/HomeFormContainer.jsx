import React, { Component } from 'react';
import { store } from '../store';
import HomeForm from './HomeForm';
import { URLisValid } from '../helpers/Utils';

class HomeFormContainer extends Component {

	constructor() {
		super();
		
		this.state = {
			enteredURL: ""
		}

		this.handleURLchange = this.handleURLchange.bind(this);
		this.addLink = this.addLink.bind(this);
	}

	handleURLchange(e){
		this.setState({ 
			"enteredURL": e.target.value
		});
	}

	addLink(e) {
		e.preventDefault();

		let url = this.state.enteredURL;
		if(URLisValid(url)) {
			
			this.setState({ enteredURL: "" });

			let newLink = {
				"url": url,
				"title": this.state.enteredURL,
				"date": new Date()
			}

			store.dispatch({
				"type": "ADD_LINK",
				newLink
			});

			fetch("/api/add/Thib/" + encodeURIComponent(newLink.url) + '/' + newLink.date, {
				"method": "PUT",
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			})
			.then((res) => res.json())
			.then(res => {
				store.dispatch({
					"type": "UPDATE_LINK",
					"newLink": res
				});
			});
		}
	}

	render() {
		return(
			<HomeForm 
				handleURLchange={this.handleURLchange}
				enteredURL={this.state.enteredURL}
				addLink={this.addLink}
			/>
		)
	}

}

export default HomeFormContainer;