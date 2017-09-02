import React, { Component } from 'react';

class TopBar extends Component {
	render() {
		return (
			<nav className='TopBar navbar navbar-dark bg-dark'>
				<a className='navbar-brand ml-3' href='/'>BareLinks</a>
				<div className='navbar-nav mr-auto ml-3'>
					<div className='nav-item'>
						<a className='nav-link' href='/'>Tags</a>
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

export default TopBar;