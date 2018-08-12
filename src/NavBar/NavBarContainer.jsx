import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from './NavBar';

class NavBarContainer extends Component {

	render() {
		return (
			<NavBar
				isAuthenticated={this.props.isAuthenticated}
				username={this.props.username}
			/>
		)
	}
}

function mapStateToProps(store) {
	const { username, isAuthenticated } = store.userReducer;
	return { username, isAuthenticated }
}

export default connect(mapStateToProps)(NavBarContainer);