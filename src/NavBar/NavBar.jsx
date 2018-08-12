import React, { Component } from 'react';
import LoggedMenu from './UserMenu/LoggedMenu';
import NotLoggedMenu from './UserMenu/NotLoggedMenu';
import { Link } from 'react-router-dom';

class NavBar extends Component {
	render() {
		const otherLinks = this.props.isAuthenticated
			? <ul className='navbar-nav mr-auto ml-3'>
				<li className='nav-item'>
					<Link className='nav-link' to='/link1'>Link 1</Link>
				</li>
				<li className='nav-item'>
					<Link className='nav-link' to='/link2'>Link 2</Link>
				</li>
			</ul>
			: null;
		const userMenu = this.props.isAuthenticated
			? <LoggedMenu />
			: <NotLoggedMenu handleLogout={this.props.handleLogout} />;
		return (
			<nav className='NavBar navbar navbar-expand-lg navbar-dark bg-dark'>
				<Link className='navbar-brand ml-3' to='/'>App Name</Link>
				<div className='collapse navbar-collapse'>
					{otherLinks}
				</div>
				{userMenu}
			</nav>
		)
	}
}

export default NavBar;