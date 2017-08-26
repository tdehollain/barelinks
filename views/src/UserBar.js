import React, { Component } from 'react';

class UserBar extends Component {
	render() {
		return (
			<div className='UserBar'>
				<p>{this.props.username}</p>
			</div>
		);
	}
}

export default UserBar;