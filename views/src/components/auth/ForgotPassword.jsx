import React, { Component } from 'react';

export default class ForgotPassword extends Component {
	render() {
		return (
			<div className='container mt-5'>
				<div className='row justify-content-md-center'>
					<form className='form col col-lg-5' onSubmit={this.props.handleForgotPassword}>
						<div className="form-group">
							<label className='mb-1'>Email address</label>
							<input
								type="email"
								className="form-control"
								id="email"
								aria-describedby="emailHelp"
								placeholder="Enter email"
								onChange={this.props.changeEmail}
								value={this.props.email}
							/>
						</div>
						<a href='/login'>
							<small id="login" className="form-text">Remember your password? Click here to log in</small>
						</a>
						<a className='' href='/signup'>
							<small id="signup" className="mt-2 form-text">Don't have an account yet? Click here to sign up</small>
						</a>
						<button type="submit" className="btn btn-primary mt-3">Submit</button>
					</form>
				</div>
			</div>
		);
	}
}