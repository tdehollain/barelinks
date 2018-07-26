import React, { Component } from 'react';

export default class VerificationSent extends Component {
	render() {
		return (
			<div className='container mt-5'>
				<p>We sent you a verification containing a unique link</p>
				<p>Please click on that link and come back here to log in</p>
				<a href='/login'><button type="button" className="btn btn-primary mt-3">Log in</button></a>
			</div>
		);
	}
}