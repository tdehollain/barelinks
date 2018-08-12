import React from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../Components/FormField';
import '../Auth.css';

const Login = ({ username, password, handleChange, handleSubmit, validation }) => (
	<div className='authForm container mt-5'>
		<div className='row justify-content-md-center'>
			<form className='form col col-lg-5' onSubmit={handleSubmit} noValidate>
				<p>You must be logged in to view this page</p>
				<FormField
					id={'username'}
					type={'text'}
					label={'Username'}
					value={username}
					handleChange={handleChange}
					errorMessage={validation.usernameErrorMessage}
				/>
				<FormField
					id={'password'}
					type={'password'}
					label={'Password'}
					value={password}
					handleChange={handleChange}
					errorMessage={validation.passwordErrorMessage}
				/>
				<Link to='/forgotpassword'>
					<small id="forgotPassword" className="mt-3 form-text">Forgot password?</small>
				</Link>
				<Link to='/signup'>
					<small id="signup" className="mt-2 form-text">Don't have an account yet? Click here to sign up</small>
				</Link>
				<button type="submit" className="btn mt-3 btn-outline-dark">Log in</button>
			</form>
		</div>
	</div>
);

export default Login;