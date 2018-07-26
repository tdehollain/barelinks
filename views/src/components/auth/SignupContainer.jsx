import React, { Component } from 'react';
import Signup from './Signup';
import { Auth } from 'aws-amplify';

export default class SignupContainer extends Component {
	constructor() {
		super();
		this.state = {
			username: '',
			email: '',
			password1: '',
			password2: ''
		}
		this.changeUsername = this.changeUsername.bind(this);
		this.changeEmail = this.changeEmail.bind(this);
		this.changePassword1 = this.changePassword1.bind(this);
		this.changePassword2 = this.changePassword2.bind(this);
		this.handleSignup = this.handleSignup.bind(this);
	}

	changeUsername(e) {
		this.setState({ username: e.target.value });
	}

	changeEmail(e) {
		this.setState({ email: e.target.value });
	}

	changePassword1(e) {
		this.setState({ password1: e.target.value });
	}

	changePassword2(e) {
		this.setState({ password2: e.target.value });
	}

	handleSignup(e) {
		e.preventDefault();
		Auth.signUp({
			username: this.state.username,
			password: this.state.password1,
			attributes: {
				"email": this.state.email
			}
		})
			.then(user => {
				console.log('User correctly created!');
				this.props.history.push('/verificationsent');
			})
			.catch(err => {
				console.log('Error while creating the user: ' + JSON.stringify(err));
			});
	}

	render() {
		return (
			<div>
				<Signup
					changeUsername={this.changeUsername}
					changeEmail={this.changeEmail}
					changePassword1={this.changePassword1}
					changePassword2={this.changePassword2}
					username={this.state.username}
					email={this.state.email}
					password1={this.state.password1}
					password2={this.state.password2}
					handleSignup={this.handleSignup}
				/>
			</div>
		);
	}
}