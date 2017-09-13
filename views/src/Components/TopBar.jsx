import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class TopBar extends Component {
	render() {
		return (
			<nav className='TopBar navbar navbar-dark bg-dark'>
				<Link className='navbar-brand ml-3' to='/'>BareLinks</Link>
				<div className='navbar-nav mr-auto ml-3'>
					<div className='nav-item'>
						<Link className='nav-link' to='/tags'>Tags</Link>
					</div>
				</div>
				<div>
					<button className='btn btn-outline-secondary mr-3'>Search</button>
					<button className='btn btn-outline-secondary mr-3'>Log in</button>
				</div>
			</nav>
		);
	}
}