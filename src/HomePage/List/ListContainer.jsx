import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from './List';
import listActions from './listActions';

class ListContainer extends Component {

	componentDidMount() {
		this.props.loadList(this.props.username, this.props.linksPerPage, this.props.page);
	}

	handleNextPage() {
		if (this.props.page < this.props.maxPages) {
			this.props.loadNextPage();
		}
	}

	handlePreviousPage() {
		if (this.props.page > 1) {
			this.props.loadPreviousPage();
		}
	}

	render() {
		return (
			<List
				list={this.props.list}
				maxTags={this.props.maxTags}
				currentPage={this.props.page}
				maxPages={this.props.maxPages}
				handleNextPage={this.handleNextPage}
				handlePreviousPage={this.handlePreviousPage}
			/>
		);
	}

}

const mapStateToProps = (store) => {
	return {
		list: store.listReducer.visibleList,
		page: store.listReducer.page,
		username: store.userReducer.username,
		linksPerPage: store.userReducer.settings.linksPerPage,
		maxPages: store.listReducer.maxPages,
		maxTags: store.userReducer.settings.maxTags
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		loadList: (username, linksPerPage, page) => dispatch(listActions.loadList(username, linksPerPage, page)),
		loadNextPage: () => dispatch(listActions.loadNextPage),
		loadPreviousPage: () => dispatch(listActions.loadPreviousPage)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ListContainer);