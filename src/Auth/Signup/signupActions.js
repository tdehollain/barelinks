import { Auth } from 'aws-amplify';
import history from '../../helpers/history/history';
import { validatePassword } from '../../utils/util';

import signupActionTypes from './signupActionTypes';

const validateSignupForm = (username, email, password1, password2) => {
	return async (dispatch) => {
		let validation = {
			success: true,
			usernameErrorMessage: '',
			emailErrorMessage: '',
			password1ErrorMessage: '',
			password2ErrorMessage: ''
		};

		if (username === '') {
			validation.usernameErrorMessage = 'This field is required';
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

		dispatch({ type: signupActionTypes.SIGNUP_FORM_VALDIDATION, validation });
	}
}

const resetSignupValidation = () => {
	return { type: signupActionTypes.SIGNUP_RESET_VALIDATION };
}

const signupUser = (username, email, password) => {
	return async (dispatch) => {
		dispatch(signupRequest());
		try {
			await Auth.signUp({ username, password, attributes: { email, preferred_username: username } });
			history.push('/verificationsent');
			dispatch(signupSuccess());
		} catch (err) {
			// console.log('Error while creating the user: ' + JSON.stringify(err));
			dispatch(signupFailure(err.message));
		}
	}
}

const signupRequest = () => {
	return { type: signupActionTypes.SIGNUP_REQUEST };
}
const signupSuccess = () => {
	return { type: signupActionTypes.SIGNUP_SUCCESS };
}
const signupFailure = (message) => {
	return { type: signupActionTypes.SIGNUP_FAILURE, message };
}

const logoutUser = () => {
	localStorage.removeItem('user');
	return { type: signupActionTypes.LOGOUT }
}

export const signupActions = {
	validateSignupForm,
	resetSignupValidation,
	signupUser,
	logoutUser,
	validatePassword
};