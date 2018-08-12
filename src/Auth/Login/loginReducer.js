import loginActionTypes from './loginActionTypes';

const initialState = {
	authenticationRequested: false,
	loginValidation: {
		success: true,
		usernameErrorMessage: '',
		passwordErrorMessage: ''
	}
}

export default (state = initialState, payload) => {
	switch (payload.type) {
		case loginActionTypes.LOGIN_FORM_VALDIDATION:
			return { ...state, loginValidation: payload.validation };
		case loginActionTypes.LOGIN_RESET_VALIDATION:
			return { ...state, loginValidation: { success: true, usernameErrorMessage: '', passwordErrorMessage: '' } };
		case loginActionTypes.LOGIN_REQUEST:
			return { ...state, authenticationRequested: true };
		case loginActionTypes.LOGIN_SUCCESS:
			return { ...state, authenticationRequested: false };
		case loginActionTypes.LOGIN_FAILURE_NOT_CONFIRMED:
			return {
				...state,
				authenticationRequested: false,
				loginValidation: { ...state.validation, success: false, usernameErrorMessage: payload.message }
			};
		case loginActionTypes.LOGIN_FAILURE_PASSWORD:
			return {
				...state,
				authenticationRequested: false,
				loginValidation: { ...state.validation, success: false, passwordErrorMessage: payload.message }
			};
		case loginActionTypes.LOGIN_FAILURE:
			return {
				...state,
				authenticationRequested: false,
				loginValidation: { ...state.validation, success: false, usernameErrorMessage: payload.message }
			};
		default: return state
	}
}