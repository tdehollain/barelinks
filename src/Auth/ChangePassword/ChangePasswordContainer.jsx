import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChangePassword from './ChangePassword';
import { changePasswordActions } from './changePasswordActions';

class ChangePasswordContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldPassword: '',
			password1: '',
			password2: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		if (!this.props.validation.success) this.props.resetChangePasswordValidation();
		this.setState({ [e.target.id]: e.target.value });
	}

	async handleSubmit(e) {
		e.preventDefault();

		this.props.resetChangePasswordValidation();

		let { oldPassword, password1, password2 } = this.state;

		await this.props.validateChangePasswordForm(oldPassword, password1, password2);

		if (this.props.validation.success) {
			this.props.changePassword(oldPassword, password1);
		}
	}

	render() {
		return (
			<ChangePassword
				oldPassword={this.state.oldPassword}
				password1={this.state.password1}
				password2={this.state.password2}
				handleChange={this.handleChange}
				handleSubmit={this.handleSubmit}
				validation={this.props.validation}
			/>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		validation: store.authReducer.changePasswordReducer.changePasswordValidation
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		validateChangePasswordForm: (oldPassword, password1, password2) => dispatch(changePasswordActions.validateChangePasswordForm(oldPassword, password1, password2)),
		resetChangePasswordValidation: () => dispatch(changePasswordActions.resetChangePasswordValidation()),
		changePassword: (oldPassword, newPassword) => dispatch(changePasswordActions.changePassword(oldPassword, newPassword))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordContainer);