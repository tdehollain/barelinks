import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { store } from '../store';
import TopBar from './TopBar';

class TopBarContainer extends Component {

	render() {
		return <TopBar username="Thib" />
	}

}

export default TopBarContainer;