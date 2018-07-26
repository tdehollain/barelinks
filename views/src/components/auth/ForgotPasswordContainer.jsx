import React, { Component } from 'react';
import ForgotPassword from './ForgotPassword';

export default class ForgotPasswordContainer extends Component {
	constructor() {
		super();
		this.state = {
			email: ''
		}
		this.changeEmail = this.changeEmail.bind(this);
	}

	changeEmail(e) {
		this.setState({ email: e.target.value });
	}

	handleForgotPassword() {

	}


	render() {
		return (
			<div>
				<ForgotPassword
					email={this.state.email}
					changeEmail={this.changeEmail}
					handleForgotPassword={this.handleForgotPassword}
				/>
			</div>
		);
	}
}