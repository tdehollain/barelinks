import React from 'react';
import HomeFormContainer from './HomeForm/HomeFormContainer';
import ListContainer from './List/ListContainer';
import AddTagModalContainer from "../AddTagModal/AddTagModalContainer";

const HomePage = () =>
	<div className='HomePage container mt-5'>
		<HomeFormContainer />
		<ListContainer />
		<AddTagModalContainer />
	</div>

export default HomePage;