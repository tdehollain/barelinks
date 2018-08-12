import React, { Component } from 'react';
import { connect } from 'react-redux';
import Signup from './Signup';
import { signupActions } from './signupActions';

class SignupContainer extends Component {
	constructor() {
		super();
		this.state = {
			username: '',
			email: '',
			password1: '',
			password2: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		if (!this.props.validation.success) this.props.resetSignupValidation();
		this.setState({ [e.target.id]: e.target.value });
	}

	async handleSubmit(e) {
		e.preventDefault();
		this.props.resetSignupValidation();

		let { username, email, password1, password2 } = this.state;

		await this.props.validateSignupForm(username, email, password1, password2);

		if (this.props.validation.success) this.props.signupUser(username, email, password1);
	}

	render() {
		return (
			<div>
				<Signup
					username={this.state.username}
					email={this.state.email}
					password1={this.state.password1}
					password2={this.state.password2}
					handleChange={this.handleChange}
					handleSubmit={this.handleSubmit}
					validation={this.props.validation}
				/>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		validation: store.authReducer.signupReducer.signupValidation
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		validateSignupForm: (username, email, password1, password2) => dispatch(signupActions.validateSignupForm(username, email, password1, password2)),
		resetSignupValidation: () => dispatch(signupActions.resetSignupValidation()),
		signupUser: (username, email, password) => dispatch(signupActions.signupUser(username, email, password))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer);