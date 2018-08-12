import changePasswordActionTypes from './changePasswordActionTypes';

const initialState = {
	changePasswordRequested: false,
	changePasswordValidation: {
		success: true,
		oldPasswordErrorMessage: '',
		password1ErrorMessage: '',
		password2ErrorMessage: ''
	}
};

export default (state = initialState, payload) => {
	switch (payload.type) {
		case changePasswordActionTypes.CHANGE_PASSWORD_FORM_VALDIDATION:
			return { ...state, changePasswordValidation: payload.validation };
		case changePasswordActionTypes.CHANGE_PASSWORD_RESET_VALIDATION:
			return {
				...state, changePasswordValidation: {
					success: true,
					oldPasswordErrorMessage: '',
					password1ErrorMessage: '',
					password2ErrorMessage: ''
				}
			};
		case changePasswordActionTypes.CHANGE_PASSWORD_REQUEST:
			return { ...state, changePasswordRequested: true };
		case changePasswordActionTypes.CHANGE_PASSWORD_SUCCESS:
			return { ...state, changePasswordRequested: false };
		case changePasswordActionTypes.CHANGE_PASSWORD_FAILURE_PASSWORD:
			return {
				...state,
				changePasswordRequested: false,
				changePasswordValidation: { ...state.validation, success: false, oldPasswordErrorMessage: payload.message }
			};
		case changePasswordActionTypes.CHANGE_PASSWORD_FAILURE:
			return {
				...state,
				changePasswordRequested: false,
				changePasswordValidation: { ...state.validation, success: false, oldPasswordErrorMessage: payload.message }
			};
		default: return state;
	}
};