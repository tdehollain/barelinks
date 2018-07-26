import React, { Component } from 'react';

export default class Login extends Component {
	render() {
		let validatedClass = 'form col col-lg-5 ' + (this.props.validation.validated ? 'was-validated' : 'needs-validation');
		let invalidUserDiv = this.props.validation.validated ?
			<div className={this.props.validation.errorMsgUser ? 'invalid-feedback' : 'valid-feedback'}>
				{this.props.validation.errorMsgUser}
			</div>
			: null;
		let invalidPwdDiv = this.props.validation.validated ?
			<div className={this.props.validation.errorMsgPwd ? 'invalid-feedback' : 'valid-feedback'}>
				{this.props.validation.errorMsgPwd}
			</div>
			: null;
		return (
			<div className='container mt-5'>
				<div className='row justify-content-md-center'>
					<form className={validatedClass} onSubmit={this.props.handleLogin} noValidate>
						<p>You must be logged in to view this page</p>
						<div className="form-group">
							<label className='mb-1'>Username</label>
							<input
								type="text"
								className="form-control"
								id="username"
								aria-describedby="usernameHelp"
								placeholder="Enter username"
								onChange={this.props.changeUsername}
								value={this.props.username}
								required
							/>
							{invalidUserDiv}
						</div>
						<div className="form-group mb-0">
							<label className='mb-1'>Password</label>
							<input
								type="password"
								className="form-control"
								id="password"
								placeholder="Password"
								onChange={this.props.changePassword}
								value={this.props.password}
								required
							/>
							{invalidPwdDiv}
						</div>
						<a href='/forgotpassword'>
							<small id="forgotPassword" className="form-text">Forgot password?</small>
						</a>
						<a className='' href='/signup'>
							<small id="signup" className="mt-2 form-text">Don't have an account yet? Click here to sign up</small>
						</a>
						<button type="submit" className="btn btn-primary mt-3">Log in</button>
					</form>
				</div>
			</div>
		);
	}
}