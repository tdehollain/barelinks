import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import HomeForm from './HomeForm';
import API from '../helpers/API';
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

	handleURLchange(e) {
		this.setState({
			"enteredURL": e.target.value
		});
	}

	async addLink(e) {
		e.preventDefault();

		let url = this.state.enteredURL;
		if (URLisValid(url)) {

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

			let newLinkFromServer = await API.putLink(this.props.userState.username, url);
			store.dispatch({
				"type": "UPDATE_LINK",
				"newLink": newLinkFromServer.res
			});

		}
	}

	render() {
		return (
			<HomeForm
				handleURLchange={this.handleURLchange}
				enteredURL={this.state.enteredURL}
				addLink={this.addLink}
			/>
		)
	}

}

const mapStateToProps = (store) => {
	return {
		userState: store.userState
	}
}

export default connect(mapStateToProps)(HomeFormContainer);