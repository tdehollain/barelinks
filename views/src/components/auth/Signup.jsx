import React, { Component } from 'react';

export default class Signup extends Component {
	render() {
		return (
			<div className='container mt-5'>
				<div className='row justify-content-md-center'>
					<form className='form col col-lg-5' onSubmit={this.props.handleSignup}>
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
							/>
						</div>
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
						<div className="form-group">
							<label className='mb-1'>Password</label>
							<input
								type="password"
								className="form-control"
								id="password1"
								placeholder="Password"
								onChange={this.props.changePassword1}
								value={this.props.password1}
							/>
						</div>
						<div className="form-group mb-0">
							<label className='mb-1'>Re-enter password</label>
							<input
								type="password"
								className="form-control"
								id="password2"
								placeholder="Re-enter password"
								onChange={this.props.changePassword2}
								value={this.props.password2}
							/>
						</div>
						<a href='/login'>
							<small id="forgotPassword" className="form-text">Already have an account? Click here to log in</small>
						</a>
						<button type="submit" className="btn btn-primary mt-3">Sign up</button>
					</form>
				</div>
			</div>
		);
	}
}