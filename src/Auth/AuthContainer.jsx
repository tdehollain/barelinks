import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginContainer from './Login/LoginContainer';
import SignupContainer from './Signup/SignupContainer';
import ChangePasswordContainer from './ChangePassword/ChangePasswordContainer';
import PasswordChanged from './PasswordChanged/PasswordChanged';
import ForgotPasswordContainer from './ForgotPassword/ForgotPasswordContainer';
import VerificationSent from './VerificationsSent/VerificationSent';
import ResetPasswordContainer from './ResetPassword/ResetPasswordContainer';

export default class AuthContainer extends Component {
	render() {
		return (
			<div>
				<Switch>
					<Route path='/login/' component={LoginContainer} />
					<Route path='/signup/' component={SignupContainer} />
					<Route path='/changepassword/' component={ChangePasswordContainer} />
					<Route path='/passwordchanged/' component={PasswordChanged} />
					<Route path='/forgotpassword/' component={ForgotPasswordContainer} />
					<Route path='/resetpassword/' component={ResetPasswordContainer} />
					<Route path='/verificationsent/' component={VerificationSent} />
				</Switch>
			</div>
		);
	}
}