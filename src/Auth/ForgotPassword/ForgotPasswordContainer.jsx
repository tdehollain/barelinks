import React, { Component } from 'react';
import { connect } from 'react-redux';
import { forgotPasswordActions } from './forgotPasswordActions';
import ForgotPassword from './ForgotPassword';

class ForgotPasswordContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value });
	}

	async handleSubmit(e) {
		e.preventDefault();
		this.props.forgotPassword(this.state.email);
	}


	render() {
		return (
			<div>
				<ForgotPassword
					email={this.state.email}
					handleChange={this.handleChange}
					handleSubmit={this.handleSubmit}
				/>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		forgotPassword: (email) => dispatch(forgotPasswordActions.forgotPassword(email))
	};
}

export default connect(null, mapDispatchToProps)(ForgotPasswordContainer);