import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { withRouter, Route, Redirect } from 'react-router-dom';

class PrivateRoute extends Component {
	constructor() {
		super();
		this.state = {
			loaded: false,
			isAuthenticated: false
		}
	}

	authenticate() {
		Auth.currentAuthenticatedUser()
			.then(user => {
				this.setState({
					loaded: true,
					isAuthenticated: true
				});
			})
			.catch(err => {
				this.props.history.push('/login');
			});
	}

	componentDidMount() {
		this.authenticate();
		this.unlisten = this.props.history.listen(() => {
			Auth.currentAuthenticatedUser()
				.then()
				.catch(() => {
					if (this.state.isAuthenticated) this.setState({ isAuthenticated: false });
				});
		});
	}

	componentWillUnmount() {
		this.unlisten();
	}


	render() {
		const { component: Component, ...rest } = this.props;
		const { loaded, isAuthenticated } = this.state;
		if (!loaded) return null;
		return (
			<Route
				{...rest}
				render={props => {
					return isAuthenticated ? (
						<Component {...props} />
					) : (
							<Redirect
								to={{
									pathname: '/login'
								}}
							/>
						)
				}}
			/>
		);
	}
}

PrivateRoute = withRouter(PrivateRoute);

export default PrivateRoute;