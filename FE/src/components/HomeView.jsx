import React, { Component } from 'react';
import HomeFormContainer from './HomeFormContainer';
import ListContainer from './ListContainer';

class HomeView extends Component {

	render() {
		return (
			<div className='HomeView container'>
				<HomeFormContainer />
				<ListContainer />
			</div>
		);
	}

}

export default HomeView;