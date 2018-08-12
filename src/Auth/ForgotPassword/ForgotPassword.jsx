import React from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../Components/FormField';

const ForgotPassword = ({ email, handleChange, handleSubmit }) => (
	<div className='container mt-5'>
		<div className='row justify-content-md-center'>
			<form className='form col col-lg-5' onSubmit={handleSubmit}>
				<FormField
					id={'email'}
					type={'email'}
					label={'Email'}
					value={email}
					handleChange={handleChange}
				/>
				<Link to='/login'>
					<small id="login" className="form-text">Remember your password? Click here to log in</small>
				</Link>
				<Link to='/signup'>
					<small id="signup" className="mt-2 form-text">Don't have an account yet? Click here to sign up</small>
				</Link>
				<button type="submit" className="btn mt-3 btn-outline-dark">Submit</button>
			</form>
		</div>
	</div>
);

export default ForgotPassword;