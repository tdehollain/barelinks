import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import GoSearch from 'react-icons/lib/go/search';
import GoPerson from 'react-icons/lib/go/person';

export default class TopBar extends Component {

	render() {
		return (
			<nav className='TopBar navbar navbar-dark bg-dark'>
				<Link className='navbar-brand ml-3' to='/'>BareLinks</Link>
				<div className='navbar-nav mr-auto ml-3'>
					<div className='nav-item'>
						<NavLink className='nav-link' to='/tags'>Tags</NavLink>
					</div>
				</div>
				<div className='searchButton'>
					<button className='btn btn-outline-secondary mr-3'>
						<GoSearch className='mr-2'/>
						Search
					</button>
				</div>
				<div className='loginButton'>
					<button className='btn btn-outline-secondary mr-3'>
						<GoPerson className='mr-2'/>
						{this.props.username}
					</button>
				</div>
			</nav>
		);
	}
	
}