import { Auth } from 'aws-amplify';
import history from '../../helpers/history/history';
import loginActionTypes from './loginActionTypes';

const validateLoginForm = (username, password) => {
	return async (dispatch) => {
		let validation = {
			success: true,
			usernameErrorMessage: '',
			passwordErrorMessage: ''
		};

		if (username === '') {
			validation.usernameErrorMessage = 'This field is required';
			validation.success = false;
		}
		if (password === '') {
			validation.passwordErrorMessage = 'This field is required';
			validation.success = false;
		}

		dispatch({ type: loginActionTypes.LOGIN_FORM_VALDIDATION, validation });
	}
}

const resetLoginValidation = () => {
	return { type: loginActionTypes.LOGIN_RESET_VALIDATION };
}

const loginUser = (username, password, redirectTo) => {
	return async (dispatch) => {
		dispatch(loginRequest());
		try {
			let user = await Auth.signIn(username, password);
			// console.log('logged in: ' + user.username);
			localStorage.setItem('user', JSON.stringify({ username: user.username }));
			dispatch(loginSuccess(user.username));
			history.push(redirectTo);
		} catch (err) {
			console.log('error logging in: ' + JSON.stringify(err));
			switch (err.code) {
				case 'UserNotConfirmedException':
					dispatch(loginFailureNotConfirmed(err.message));
					break;
				case 'UserNotFoundException':
					dispatch(loginFailurePassword("Incorrect username or password."));
					break;
				case 'NotAuthorizedException':
					dispatch(loginFailurePassword(err.message));
					break;
				default:
					dispatch(loginFailure(err.message));
					break;
			}

		}
	}
}

const loginRequest = () => {
	return { type: loginActionTypes.LOGIN_REQUEST };
}
const loginSuccess = (username) => {
	return { type: loginActionTypes.LOGIN_SUCCESS, username };
}
const loginFailureNotConfirmed = (message) => {
	return { type: loginActionTypes.LOGIN_FAILURE_NOT_CONFIRMED, message };
}
const loginFailurePassword = (message) => {
	return { type: loginActionTypes.LOGIN_FAILURE_PASSWORD, message };
}
const loginFailure = (message) => {
	return { type: loginActionTypes.LOGIN_FAILURE, message };
}

const logoutUser = () => {
	localStorage.removeItem('user');
	return { type: loginActionTypes.LOGOUT }
}

export const loginActions = {
	validateLoginForm,
	resetLoginValidation,
	loginSuccess,
	loginUser,
	logoutUser
};