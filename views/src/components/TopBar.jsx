import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import GoSearch from 'react-icons/lib/go/search';
import GoPerson from 'react-icons/lib/go/person';

export default class TopBar extends Component {

	render() {
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
				{/* <div className='searchButton'>
					<button className='btn btn-outline-secondary mr-3'>
						<GoSearch className='mr-2'/>
						Search
					</button>
				</div> */}
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