import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../../HomePage/List/List';
import listActions from '../../HomePage/List/listActions';

class SearchViewContainer extends Component {

	constructor() {
		super();

		this.handleNextPage = this.handleNextPage.bind(this);
		this.handlePreviousPage = this.handlePreviousPage.bind(this);
	}

	componentDidMount() {
		this.props.resetList(); // if we want the list to be back to page 1 if user goes to different route and back
		let params = {
			linksPerPage: this.props.linksPerPage,
			page: this.props.page,
			searchTerm: this.props.match.params.searchTerm
		}
		this.props.loadList(this.props.username, 'searchpage', params);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.page !== this.props.page || prevProps.match.params.searchTerm !== this.props.match.params.searchTerm) {
			this.props.resetList();
			let params = {
				linksPerPage: this.props.linksPerPage,
				page: this.props.page,
				searchTerm: this.props.match.params.searchTerm
			}
			this.props.loadList(this.props.username, 'searchpage', params);
		}
	}

	// componentWillReceiveProps(nextProps) {
	// 	// console.log('componentWillReceiveProps');
	// 	if (nextProps.page !== this.props.page) {
	// 		let params = {
	// 			linksPerPage: this.props.linksPerPage,
	// 			page: this.props.page,
	// 			searchTerm: this.props.match.params.searchTerm
	// 		}
	// 		this.props.loadList(this.props.username, 'searchpage', params);
	// 	}

	// 	if (nextProps.match.params.searchTerm !== this.props.match.params.searchTerm) {
	// 		let params = {
	// 			linksPerPage: this.props.linksPerPage,
	// 			page: this.props.page,
	// 			searchTerm: this.props.match.params.searchTerm
	// 		}
	// 		this.props.loadList(this.props.username, 'searchpage', params);
	// 	}
	// }

	handleNextPage() {
		if (this.props.page < this.props.maxPages) {
			let params = {
				linksPerPage: this.props.linksPerPage,
				page: this.props.page + 1,
				searchTerm: this.props.match.params.searchTerm
			}
			this.props.loadList(this.props.username, 'searchpage', params);
			this.props.nextPage();
		}
	}

	handlePreviousPage() {
		if (this.props.page > 1) {
			let params = {
				linksPerPage: this.props.linksPerPage,
				page: this.props.page - 1,
				searchTerm: this.props.match.params.searchTerm
			}
			this.props.loadList(this.props.username, 'searchpage', params);
			this.props.previousPage();
		}
	}

	render() {
		return (
			<div>
				<div className='mt-3 mb-3'>
					<span><u>Showing results for term</u> {this.props.match.params.searchTerm}</span>
				</div>
				<List
					list={this.props.list}
					maxTags={this.props.maxTags}
					currentPage={this.props.page}
					maxPages={this.props.maxPages}
					handleNextPage={this.handleNextPage}
					handlePreviousPage={this.handlePreviousPage}
					loading={this.props.loading}
				/>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		username: store.userReducer.username,
		maxTags: store.userReducer.settings.maxTags,
		linksPerPage: store.userReducer.settings.linksPerPage,
		list: store.listReducer.visibleList,
		page: store.listReducer.page,
		loading: store.listReducer.loading,
		maxPages: store.listReducer.maxPages,
		commonTags: store.listReducer.commonTags
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		resetList: () => dispatch(listActions.resetList()),
		loadList: (username, type, params) => dispatch(listActions.loadList(username, type, params)),
		nextPage: () => dispatch(listActions.nextPage()),
		previousPage: () => dispatch(listActions.previousPage()),
		loadCommonTags: (username) => dispatch(listActions.loadCommonTags(username))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchViewContainer);