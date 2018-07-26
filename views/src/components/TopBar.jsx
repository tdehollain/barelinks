import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import GoSearch from 'react-icons/lib/go/search';
import GoPerson from 'react-icons/lib/go/person';

import { Auth } from 'aws-amplify';

export default class TopBar extends Component {

	render() {
		let loginButton = this.props.isAuthenticated ?
			<div className='loginButton'>
				<button className='btn btn-outline-secondary mr-3'>
					<GoPerson className='mr-2' />
					{this.props.username}
				</button>
			</div> :
			<div className='loginButton'>
				<a href='/login'>
					<button className='btn btn-outline-secondary mr-3'>
						Log in
					</button>
				</a>
			</div>

		return (
			<nav className='TopBar navbar navbar-expand-lg navbar-dark bg-dark'>
				<Link className='navbar-brand ml-3' to='/'>BareLinks</Link>
				<div className='collapse navbar-collapse'>
					<ul className='navbar-nav mr-auto ml-3'>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/tags'>Tags</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/search'>Search</NavLink>
						</li>
					</ul>
				</div>
				{loginButton}
				<div className='logoutButton'>
					<button className='btn btn-outline-secondary mr-3' onClick={this.props.handleLogout.bind(this)}>
						Log out
					</button>
				</div>
			</nav>
		);
	}

}