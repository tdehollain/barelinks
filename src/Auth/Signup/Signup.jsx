import React from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../Components/FormField';
import '../Auth.css';

const Signup = ({ username, email, password1, password2, handleChange, handleSubmit, validation }) => (
	<div className='authForm container mt-5'>
		<div className='row justify-content-md-center'>
			<form className='form col col-lg-5' onSubmit={handleSubmit}>
				<FormField
					id={'username'}
					type={'text'}
					label={'Username'}
					value={username}
					handleChange={handleChange}
					errorMessage={validation.usernameErrorMessage}
				/>
				<FormField
					id={'email'}
					type={'email'}
					label={'Email'}
					value={email}
					handleChange={handleChange}
					errorMessage={validation.emailErrorMessage}
				/>
				<FormField
					id={'password1'}
					type={'password'}
					label={'Password'}
					value={password1}
					handleChange={handleChange}
					errorMessage={validation.password1ErrorMessage}
				/>
				<FormField
					id={'password2'}
					type={'password'}
					label={'Re-enter password'}
					value={password2}
					handleChange={handleChange}
					errorMessage={validation.password2ErrorMessage}
				/>
				<Link to='/login'>
					<small id="forgotPassword" className="form-text">Already have an account? Click here to log in</small>
				</Link>
				<button type="submit" className="btn mt-3 btn-outline-dark">Sign up</button>
			</form>
		</div>
	</div>
);

export default Signup;