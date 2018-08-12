import React from 'react';
import FormField from '../../Components/FormField';

const ChangePassword = ({ oldPassword, password1, password2, handleChange, handleSubmit, validation }) => (
	<div className='authForm container mt-5'>
		<div className='row justify-content-md-center'>
			<form className='form col col-lg-5' onSubmit={handleSubmit} noValidate>
				<div className="form-group">
					<FormField
						id={'oldPassword'}
						type={'password'}
						label={'Old Password'}
						value={oldPassword}
						handleChange={handleChange}
						errorMessage={validation.oldPasswordErrorMessage}
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
				</div>
				<button type="submit" className="btn mt-3 btn-outline-dark">Change Password</button>
			</form>
		</div>
	</div>
);

export default ChangePassword;