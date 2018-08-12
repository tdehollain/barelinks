import resetPasswordActionTypes from './resetPasswordActionTypes';

const initialState = {
	resetPasswordRequested: false,
	resetPasswordValidation: {
		success: true,
		codeErrorMessage: '',
		emailErrorMessage: '',
		password1ErrorMessage: '',
		password2ErrorMessage: ''
	}
}


export default (state = initialState, payload) => {
	switch (payload.type) {
		case resetPasswordActionTypes.RESET_PASSWORD_FORM_VALDIDATION:
			return { ...state, resetPasswordValidation: payload.validation };
		case resetPasswordActionTypes.RESET_PASSWORD_RESET_VALIDATION:
			return {
				...state, resetPasswordValidation: {
					success: true,
					codeErrorMessage: '',
					emailErrorMessage: '',
					password1ErrorMessage: '',
					password2ErrorMessage: ''
				}
			};
		case resetPasswordActionTypes.RESET_PASSWORD_REQUEST:
			return { ...state, resetPasswordRequested: true };
		case resetPasswordActionTypes.RESET_PASSWORD_SUCCESS:
			return { ...state, resetPasswordRequested: false };
		case resetPasswordActionTypes.RESET_PASSWORD_FAILURE_EXPIRED_CODE:
			return {
				...state,
				resetPasswordRequested: false,
				resetPasswordValidation: { ...state.validation, success: false, codeErrorMessage: payload.message }
			};
		case resetPasswordActionTypes.RESET_PASSWORD_FAILURE:
			return {
				...state,
				resetPasswordRequested: false,
				resetPasswordValidation: { ...state.validation, success: false, codeErrorMessage: payload.message }
			};
		default: return state;
	}
}