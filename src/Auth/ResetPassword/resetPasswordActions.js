import { Auth } from 'aws-amplify';
import history from '../../helpers/history/history';
import resetPasswordActionTypes from './resetPasswordActionTypes';
import { validatePassword } from '../../utils/util';
import { loginActions } from '../Login/loginActions';

const validateResetPasswordForm = (code, email, password1, password2) => {
	return async (dispatch) => {
		let validation = {
			success: true,
			codeErrorMessage: '',
			emailErrorMessage: '',
			password1ErrorMessage: '',
			password2ErrorMessage: ''
		};

		if (code === '') {
			validation.codeErrorMessage = 'This field is required';
			validation.success = false;
		}
		if (email === '') {
			validation.emailErrorMessage = 'This field is required';
			validation.success = false;
		}
		if (password1 === '') {
			validation.password1ErrorMessage = 'This field is required';
			validation.success = false;
		}
		if (password2 === '') {
			validation.password2ErrorMessage = 'This field is required';
			validation.success = false;
		}
		if (validation.success && (password1 !== password2)) {
			validation.password1ErrorMessage = 'The passwords don\'t match';
			validation.password2ErrorMessage = 'The passwords don\'t match';
			validation.success = false;
		}
		if (validation.success) {
			let passwordValidationResult = validatePassword(password1);
			if (!passwordValidationResult.success) {
				validation.password1ErrorMessage = passwordValidationResult.message;
				validation.password2ErrorMessage = passwordValidationResult.message;
				validation.success = false;
			}
		}

		dispatch({ type: resetPasswordActionTypes.RESET_PASSWORD_FORM_VALDIDATION, validation });
	}
}

const resetResetPasswordValidation = () => {
	return { type: resetPasswordActionTypes.RESET_PASSWORD_RESET_VALIDATION };
}

const resetPassword = (username, code, password) => {
	return async (dispatch) => {
		dispatch(resetPasswordRequest());
		try {
			await Auth.forgotPasswordSubmit(username, code, password);
			dispatch(resetPasswordSuccess());
			// console.log('reset password was successful');
			let user = await Auth.signIn(username, password);
			// console.log('logged in: ' + user.username);
			localStorage.setItem('user', JSON.stringify({ username: user.username }));
			dispatch(loginActions.loginSuccess(user.username));
			history.push('/passwordchanged');
		} catch (err) {
			console.log(err);
			switch (err.code) {
				case 'ExpiredCodeException':
					dispatch(resetPasswordFailureExpiredCode(err.message));
					break;
				default:
					dispatch(resetPasswordFailure(err.message));
					break;
			}
		}
	}
}

const resetPasswordRequest = () => {
	return { type: resetPasswordActionTypes.RESET_PASSWORD_REQUEST };
}
const resetPasswordSuccess = () => {
	return { type: resetPasswordActionTypes.RESET_PASSWORD_SUCCESS };
}
const resetPasswordFailureExpiredCode = (message) => {
	return { type: resetPasswordActionTypes.RESET_PASSWORD_FAILURE_EXPIRED_CODE, message };
}
const resetPasswordFailure = (message) => {
	return { type: resetPasswordActionTypes.RESET_PASSWORD_FAILURE, message };
}

export const resetPasswordActions = {
	validateResetPasswordForm,
	resetResetPasswordValidation,
	resetPassword
};