import signupActionTypes from './signupActionTypes';

const initialState = {
	signupRequested: false,
	signupValidation: {
		success: true,
		usernameErrorMessage: '',
		emailErrorMessage: '',
		password1ErrorMessage: '',
		password2ErrorMessage: ''
	}
}

export default (state = initialState, payload) => {
	switch (payload.type) {
		case signupActionTypes.SIGNUP_FORM_VALDIDATION:
			return { ...state, signupValidation: payload.validation };
		case signupActionTypes.SIGNUP_RESET_VALIDATION:
			return {
				...state, signupValidation: {
					success: true,
					usernameErrorMessage: '',
					emailErrorMessage: '',
					password1ErrorMessage: '',
					password2ErrorMessage: ''
				}
			};
		case signupActionTypes.SIGNUP_REQUEST:
			return { ...state, signupRequested: true };
		case signupActionTypes.SIGNUP_SUCCESS:
			return { ...state, signupRequested: false };
		case signupActionTypes.SIGNUP_FAILURE:
			return {
				...state,
				signupRequested: false,
				isAuthenticated: false,
				signupValidation: { ...state.validation, success: false, usernameErrorMessage: payload.message }
			};
		default: return state;
	}
}