import React, { Component } from 'react';
import { store } from '../store';
import { connect } from 'react-redux';
import ListContainer from './ListContainer';
import CommonTag from './CommonTag';

class SearchViewListContainer extends Component {

	constructor() {
		super();
		this.state = {
		}
	}

	componentWillMount() {
		// console.log('componentWillMount');
		store.dispatch({ "type": 'RESET_LIST' });
		this.setState({
			"searchTerm": this.props.match.params.searchTerm
		});
	}

	componentDidMount() {
		// console.log('componentDidMount');
		this.resetList(this.props.match.params.searchTerm);
	}

	componentWillReceiveProps(nextProps) {
		// console.log('componentWillReceiveProps');
		if(nextProps.list.page !== this.props.list.page) {
			this.API_updateList(nextProps.match.params.searchTerm, nextProps.list.page);
		}

		if(nextProps.match.params.searchTerm !== this.props.match.params.searchTerm) {
			this.resetList(nextProps.match.params.searchTerm);
		}
	}

	resetList(searchTerm) {
		// get list
		this.API_updateList(searchTerm, 1);
		this.setState({ "searchTerm": searchTerm });
	}

	API_updateList(searchTerm, page){
		fetch('/api/getLinksBySearchTerm/Thib/' + searchTerm + '/' + page + '/' + this.props.userSettings.linksPerPage)
			.then(res => res.json())
			.then(res => {
				// update list of links
				store.dispatch({
					"type": 'UPDATE_LIST',
					"list": res.list,
					"count": res.totalCount
				});
			});
	}

	render() {
		return (
			<div className='mt-5'>
				<div className='mb-3'>
					<span><u>Showing results for term</u> {this.state.searchTerm}</span>
					</div>
				<ListContainer
					userSettings={this.props.userSettings}
					list={this.props.list}
				/>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		list: store.listState,
		userSettings: store.userState.userSettings
	}
}

export default connect(mapStateToProps)(SearchViewListContainer);