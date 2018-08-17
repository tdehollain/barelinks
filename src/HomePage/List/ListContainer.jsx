import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import List from './List';
import listActions from './listActions';

class ListContainer extends Component {

	render() {
		return (
			< List
				list={this.props.list}
				maxTags={this.props.maxTags}
				currentPage={this.props.page}
				maxPages={this.props.maxPages}
				handleNextPage={this.props.handleNextPage}
				handlePreviousPage={this.props.handlePreviousPage}
				loading={this.props.loading}
			/>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		loading: store.listReducer.loading,
		page: store.listReducer.page,
		linksPerPage: store.userReducer.settings.linksPerPage,
		maxTags: store.userReducer.settings.maxTags
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListContainer));