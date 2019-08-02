import React, { Component } from 'react';
import IoPerson from 'react-icons/lib/io/person';
import IoPersonAdd from 'react-icons/lib/io/person-add';
import GoSignIn from 'react-icons/lib/go/sign-in';
import { Link } from 'react-router-dom';

class NotLoggedMenu extends Component {
	render() {
		return (
			<div className='userMenu'>
				<div className='userButton'>
					<button className='btn btn-outline-secondary mr-3'>
						<IoPerson style={{ fontSize: '1.2rem' }} className='mr-2' />
						Log in / Sign up
					</button>
				</div>
				<div className='userMenuDropDown'>
					<div className='loginButton'>
						<Link to='/login'>
							<button className='btn btn-outline-secondary mr-3'>
								<GoSignIn className='mr-2' />
								Log in
							</button>
						</Link>
					</div>
					<hr style={{ background: '#ECEFF1', margin: '0 8px' }}></hr>
					<div className='signUpButton'>
						<Link to='/signup'>
							<button className='btn btn-outline-secondary mr-3'>
								<IoPersonAdd style={{ fontSize: '1.2rem' }} className='mr-2' />
								Sign up
							</button>
						</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default NotLoggedMenu;