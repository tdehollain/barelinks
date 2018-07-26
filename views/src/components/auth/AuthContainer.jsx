import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginContainer from './LoginContainer';
import SignupContainer from './SignupContainer';
import ForgotPasswordContainer from './ForgotPasswordContainer';
import VerificationSent from './VerificationSent';

export default class AuthContainer extends Component {
	render() {
		return (
			<div>
				<Switch>
					<Route path='/login/' component={LoginContainer} />
					<Route path='/signup/' component={SignupContainer} />
					<Route path='/forgotpassword/' component={ForgotPasswordContainer} />
					<Route path='/verificationsent/' component={VerificationSent} />
				</Switch>
			</div>
		);
	}
}