import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from './List';
import listActions from './listActions';
import ListPagination from './ListPagination/ListPagination';
import { css } from 'react-emotion';
import { RingLoader } from 'react-spinners';

class ListContainer extends Component {
	constructor(props) {
		super(props);
		this.handleNextPage = this.handleNextPage.bind(this);
		this.handlePreviousPage = this.handlePreviousPage.bind(this);
	}

	componentDidMount() {
		// this.props.resetList();
		this.props.loadList(this.props.username, this.props.linksPerPage, this.props.page);
	}

	handleNextPage() {
		if (this.props.page < this.props.maxPages) {
			this.props.loadList(this.props.username, this.props.linksPerPage, this.props.page + 1);
			this.props.nextPage();
		}
	}

	handlePreviousPage() {
		if (this.props.page > 1) {
			this.props.loadList(this.props.username, this.props.linksPerPage, this.props.page - 1);
			this.props.previousPage();
		}
	}

	render() {
		let spinnerCss = css`
				margin: 50px auto;
			`;
		return (
			<div className='LinksList'>
				{this.props.maxPages > 1 &&
					<ListPagination
						currentPage={this.props.page}
						maxPages={this.props.maxPages}
						handleNextPage={this.handleNextPage}
						handlePreviousPage={this.handlePreviousPage}
					/>}
				{this.props.loading
					?
					<RingLoader
						className={spinnerCss}
						sizeUnit={"px"}
						size={50}
						color={'#343a40'}
						loading={this.props.loading}
					/>
					:
					< List
						list={this.props.list}
						maxTags={this.props.maxTags}
					/>
				}
			</div>
		);
	}

}

const mapStateToProps = (store) => {
	return {
		list: store.listReducer.visibleList,
		loading: store.listReducer.loading,
		page: store.listReducer.page,
		username: store.userReducer.username,
		linksPerPage: store.userReducer.settings.linksPerPage,
		maxPages: store.listReducer.maxPages,
		maxTags: store.userReducer.settings.maxTags
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		resetList: () => dispatch(listActions.resetList()),
		loadList: (username, linksPerPage, page) => dispatch(listActions.loadList(username, linksPerPage, page)),
		nextPage: () => dispatch(listActions.nextPage()),
		previousPage: () => dispatch(listActions.previousPage())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ListContainer);