import React from 'react';
import { Link } from 'react-router-dom';

const PasswordChanged = () => (
	<div className='container mt-5'>
		<p>Your password has been successfully changed.</p>
		<Link to='/'><button type="button" className="btn mt-3 btn-outline-dark">Go to home</button></Link>
	</div>
);

export default PasswordChanged;