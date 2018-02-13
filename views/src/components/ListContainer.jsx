import React, { Component } from 'react';
import { store } from '../store';
import List from './List';

class ListContainer extends Component {

	handleNextPage() {
		store.dispatch({
			"type": 'NEXT_PAGE'
		});
	}

	handlePreviousPage() {
		store.dispatch({
			"type": 'PREVIOUS_PAGE'
		});
	}

	render() {
		return (
			<List 
				list={this.props.list.visibleList}
				maxTags={this.props.userSettings.maxTags}
				currentPage={this.props.list.page}
				maxPages={this.props.list.maxPages}
				handleNextPage={this.handleNextPage}
				handlePreviousPage={this.handlePreviousPage}
			/>
		);
	}

}

export default ListContainer;