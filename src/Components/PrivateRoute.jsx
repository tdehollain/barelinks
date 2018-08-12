import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { Auth } from '../../../node_modules/aws-amplify';

export const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		localStorage.getItem('user')
			? <Component {...props} />
			: <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
	)} />
)