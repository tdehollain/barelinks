import { combineReducers } from 'redux';
import changePasswordReducer from '../Auth/ChangePassword/changePasswordReducer';
import resetPasswordReducer from '../Auth/ResetPassword/resetPasswordReducer';
import signupReducer from '../Auth/Signup/signupReducer';
import loginReducer from '../Auth/Login/loginReducer';

const authReducer = combineReducers({
	changePasswordReducer,
	resetPasswordReducer,
	signupReducer,
	loginReducer
});

export default authReducer;