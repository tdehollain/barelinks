import { Auth } from 'aws-amplify';
import history from '../../helpers/history/history';
// import forgotPasswordActionTypes from './forgotPasswordActionTypes';

const forgotPassword = (email) => {
	return async (dispatch) => {

		try {
			localStorage.setItem('email', email);
			await Auth.forgotPassword(email);
			history.push('/resetpassword');
		} catch (err) {
			console.log(err);
			history.push('/resetpassword');
		}
	}
}

export const forgotPasswordActions = {
	forgotPassword
}