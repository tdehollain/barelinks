import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import TopBar from './TopBar';
import { Auth } from 'aws-amplify';
import { withRouter } from 'react-router-dom';

class TopBarContainer extends Component {

	constructor() {
		super();
		this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogout() {
		Auth.signOut()
			.then(data => {
				store.dispatch({
					type: 'UPDATE_USER',
					isAuthenticated: false,
					username: ''
				})
				this.props.history.push('/login');
				console.log('successfully logged out: ');
			})
			.catch(err => {
				console.log('Error while logging out: ' + err);
			});
	}

	render() {
		return (
			<TopBar
				isAuthenticated={this.props.user.isAuthenticated}
				username={this.props.user.username}
				handleLogout={this.handleLogout}
			/>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		user: store.userState
	}
}

TopBarContainer = withRouter(TopBarContainer);
export default connect(mapStateToProps)(TopBarContainer);