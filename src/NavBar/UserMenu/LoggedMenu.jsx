import React, { Component } from 'react';
import { connect } from 'react-redux';
import IoPerson from 'react-icons/lib/io/person';
import GoKey from 'react-icons/lib/go/key';
import GoSignOut from 'react-icons/lib/go/sign-out';
import { Link } from 'react-router-dom';

class LoggedMenu extends Component {
	render() {
		return (
			<div className='form-inline userMenu'>
				<div className='userButton'>
					<button className='btn btn-outline-secondary mr-3'>
						<IoPerson style={{ fontSize: '1.2rem' }} className='mr-2' />
						{this.props.username}
					</button>
				</div>
				<div className='changePasswordButton'>
					<Link to='/changepassword'>
						<button className='btn btn-outline-secondary mr-3'>
							<GoKey style={{ fontSize: '1.2rem' }} className='mr-2' />
							Change Password
						</button>
					</Link>
				</div>
				<div className='logoutButton'>
					<Link to='/login'>
						<button className='btn btn-outline-secondary mr-3'>
							<GoSignOut className='mr-2' />
							Log out
						</button>
					</Link>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		username: state.userReducer.username
	}
}

export default connect(mapStateToProps)(LoggedMenu);