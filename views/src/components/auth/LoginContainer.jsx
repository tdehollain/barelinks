import React, { Component } from 'react';
import { store } from '../../store';
import Login from './Login';
import { Auth } from 'aws-amplify';

export default class LoginContainer extends Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			validation: {
				validated: false,
				errorMsgUser: '',
				errorMsgPwd: ''
			}
		}
		this.changeUsername = this.changeUsername.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	changeUsername(e) {
		this.setState({ username: e.target.value });
	}

	changePassword(e) {
		this.setState({ password: e.target.value });
	}

	handleLogin(e) {
		e.preventDefault();
		// Reset validation
		this.setState({
			validation: {
				validated: false,
				errorMsgUser: '',
				errorMsgPwd: ''
			}
		});
		let prevalidaton = this.prevalidateForm();
		if (!prevalidaton.success) {
			this.setState({
				validation: {
					validated: true,
					errorMsgUser: prevalidaton.errorMsgUser,
					errorMsgPwd: prevalidaton.errorMsgPwd
				}
			});
		} else {
			Auth.signIn(this.state.username, this.state.password)
				.then(user => {
					console.log('correctly signed in!');
					store.dispatch({
						type: 'UPDATE_USER',
						isAuthenticated: true,
						username: this.state.username
					});
					this.props.history.push('/');
				})
				.catch(err => {
					console.log('error while logging in: ' + JSON.stringify(err));
					this.setState({
						validation: {
							validated: true,
							errorMsgUser: '',
							errorMsgPwd: 'Incorrect username or password'
						}
					});
				});
		}

	}

	prevalidateForm() {
		let prevalidaton = {
			success: true,
			errorMsgUser: '',
			errorMsgPwd: ''
		};
		let { username, password } = this.state;
		if (username === '') {
			prevalidaton.errorMsgUser = 'This field is required';
			prevalidaton.success = false;
		};
		if (password === '') {
			prevalidaton.errorMsgPwd = 'This field is required';
			prevalidaton.success = false;
		};
		return prevalidaton;
	}

	render() {
		return (
			<div>
				<Login
					changeUsername={this.changeUsername}
					changePassword={this.changePassword}
					username={this.state.username}
					password={this.state.password}
					handleLogin={this.handleLogin}
					validation={this.state.validation}
				/>
			</div>
		);
	}
}