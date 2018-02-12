import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import List from './List';

class ListContainer extends Component {

	componentDidMount() {
		this.API_updateList(this.props.list.page);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.list.page !== this.props.list.page) {
			this.API_updateList(nextProps.list.page);
		}
	}

	API_updateList(page){
		fetch('/api/get/Thib/' + page + '/' + this.props.userSettings.linksPerPage)
			.then(res => res.json())
			.then(res => {
				store.dispatch({
					"type": 'UPDATE_LIST',
					"list": res.list,
					"count": res.totalCount,
					"commonTags": res.commonTags
				});
			});
	}

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

const mapStateToProps = (store) => {
	return {
		list: store.listState,
		userSettings: store.userState.userSettings
	}
}

export default connect(mapStateToProps)(ListContainer);