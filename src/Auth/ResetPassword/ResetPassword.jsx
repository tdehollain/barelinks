import React from 'react';
import FormField from '../../Components/FormField';

const ResetPassword = ({ code, email, password1, password2, handleChange, handleSubmit, validation }) => (
	<div className='authForm container mt-5'>
		<div className='row justify-content-md-center'>
			<form className='form col col-lg-5' onSubmit={handleSubmit} noValidate>
				<p className='mb-0'>We sent you a verification code if the email address you entered matches our records.</p>
				<p>Use that code below to set a new password.</p>
				<FormField
					id={'code'}
					type={'text'}
					label={'Verification code'}
					value={code}
					handleChange={handleChange}
					errorMessage={validation.codeErrorMessage}
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
				<button type="submit" className="btn mt-3 btn-outline-dark">Reset Password</button>
			</form>
		</div>
	</div >
);

export default ResetPassword;