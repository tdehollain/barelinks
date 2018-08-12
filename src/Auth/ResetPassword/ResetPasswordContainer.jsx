import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResetPassword from './ResetPassword';
import { resetPasswordActions } from './resetPasswordActions';

class ResetPasswordContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: '',
			email: localStorage.getItem('email') || '',
			password1: '',
			password2: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		if (!this.props.validation.success) this.props.resetResetPasswordValidation();
		this.setState({ [e.target.id]: e.target.value });
	}

	async handleSubmit(e) {
		e.preventDefault();
		this.props.resetResetPasswordValidation();

		let { code, email, password1, password2 } = this.state;

		await this.props.validateResetPasswordForm(code, email, password1, password2);

		if (this.props.validation.success) {
			this.props.resetPassword(email, code, password1);
		}
	}

	render() {
		return (
			<div>
				<ResetPassword
					code={this.state.code}
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
		validation: store.authReducer.resetPasswordReducer.resetPasswordValidation
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		validateResetPasswordForm: (code, email, password1, password2) => dispatch(resetPasswordActions.validateResetPasswordForm(code, email, password1, password2)),
		resetResetPasswordValidation: () => dispatch(resetPasswordActions.resetResetPasswordValidation()),
		resetPassword: (email, code, password) => dispatch(resetPasswordActions.resetPassword(email, code, password))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordContainer);