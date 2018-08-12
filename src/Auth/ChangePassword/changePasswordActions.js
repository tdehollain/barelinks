import { Auth } from 'aws-amplify';
import history from '../../helpers/history/history';
import changePasswordActionTypes from './changePasswordActionTypes.js';
import { validatePassword } from '../../utils/util';

const validateChangePasswordForm = (oldPassword, password1, password2) => {
	return async (dispatch) => {
		let validation = {
			success: true,
			oldPasswordErrorMessage: '',
			password1ErrorMessage: '',
			password2ErrorMessage: ''
		};

		if (oldPassword === '') {
			validation.oldPasswordErrorMessage = 'This field is required';
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

		dispatch({ type: changePasswordActionTypes.CHANGE_PASSWORD_FORM_VALDIDATION, validation });
	}
}

const resetChangePasswordValidation = () => {
	return { type: changePasswordActionTypes.CHANGE_PASSWORD_RESET_VALIDATION };
}

const changePassword = (oldPassword, password) => {
	return async (dispatch) => {
		dispatch(changePasswordRequest());
		try {
			let user = await Auth.currentAuthenticatedUser();
			await Auth.changePassword(user, oldPassword, password);
			dispatch(changePasswordSuccess());
			console.log('Password successfully changed');
			history.push('/passwordchanged');
		} catch (err) {
			console.log(err);
			switch (err.code) {
				case 'InvalidParameterException':
					dispatch(changePasswordFailurePassword('Invalid password'));
					break;
				case 'NotAuthorizedException':
					dispatch(changePasswordFailurePassword('Invalid password'));
					break;
				default:
					dispatch(changePasswordFailure(err.message));
					break;
			}
		}
	}
}

const changePasswordRequest = () => {
	return { type: changePasswordActionTypes.CHANGE_PASSWORD_REQUEST };
}
const changePasswordSuccess = () => {
	return { type: changePasswordActionTypes.CHANGE_PASSWORD_SUCCESS };
}
const changePasswordFailurePassword = (message) => {
	return { type: changePasswordActionTypes.CHANGE_PASSWORD_FAILURE_PASSWORD, message };
}
const changePasswordFailure = (message) => {
	return { type: changePasswordActionTypes.CHANGE_PASSWORD_FAILURE, message };
}

export const changePasswordActions = {
	validateChangePasswordForm,
	resetChangePasswordValidation,
	changePassword
};