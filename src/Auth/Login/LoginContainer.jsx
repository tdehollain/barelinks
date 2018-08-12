import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './Login';
import { loginActions } from './loginActions';

class LoginContainer extends Component {
	constructor(props) {
		super(props);

		//reset login status
		this.props.logoutUser();

		this.state = {
			username: '',
			password: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		if (!this.props.validation.success) this.props.resetLoginValidation();
		this.setState({ [e.target.id]: e.target.value });
	}

	async handleSubmit(e) {
		e.preventDefault();
		this.props.resetLoginValidation();

		let { username, password } = this.state;

		await this.props.validateLoginForm(username, password);

		if (this.props.validation.success) {
			let redirectTo = this.props.location.state ? this.props.location.state.from.pathname : '/';
			this.props.loginUser(username, password, redirectTo);
		}
	}


	render() {
		return (
			<div>
				<Login
					username={this.state.username}
					password={this.state.password}
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
		validation: store.authReducer.loginReducer.loginValidation
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		validateLoginForm: (username, password) => dispatch(loginActions.validateLoginForm(username, password)),
		resetLoginValidation: () => dispatch(loginActions.resetLoginValidation()),
		loginUser: (username, password, redirectTo) => dispatch(loginActions.loginUser(username, password, redirectTo)),
		logoutUser: () => dispatch(loginActions.logoutUser())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);