import React from 'react';
import { Link } from 'react-router-dom';

const VerificationSent = () => (
	<div className='container mt-5'>
		<p>We sent you a verification email containing a unique link</p>
		<p>Please click on that link and come back here to log in</p>
		<Link to='/login'><button type="button" className="btn mt-3 btn-outline-dark">Log in</button></Link>
	</div>
);

export default VerificationSent;