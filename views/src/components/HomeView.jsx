import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import API from '../helpers/API';
import HomeFormContainer from './HomeFormContainer';
import ListContainer from './ListContainer';

class HomeView extends Component {

	// componentWillMount() {
	// 	store.dispatch({ "type": 'RESET_LIST' });
	// }

	componentDidMount() {
		this.API_updateList(this.props.list.page);
		this.API_getTags();
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	let pageChanged = nextProps.list.page !== this.props.list.page;
	// 	let userAuthenticationChanged = nextProps.userState.isAuthenticated !== this.props.userState.isAuthenticated;
	// 	// console.log(`old length: ${this.props.list.visibleList.length}, new length: ${nextProps.list.visibleList.length}`)
	// 	let listChanged = nextProps.list.visibleList.length !== this.props.list.visibleList.length;
	// 	return pageChanged || userAuthenticationChanged || listChanged;
	// }

	// componentDidUpdate() {
	// 	this.API_updateList();
	// }

	async API_updateList() {
		let linksList = await API.getLinks(this.props.userState.username, this.props.userState.userSettings.linksPerPage, this.props.list.page);
		store.dispatch({
			"type": 'UPDATE_LIST',
			"list": linksList.list,
			"count": linksList.totalCount
		});
	}

	API_getTags() {
		fetch('/api/getTags/Thib')
			.then(res => res.json())
			.then(res => {
				store.dispatch({
					"type": 'UPDATE_TAGS',
					"tags": res.tags
				});
			});
	}

	render() {
		return (
			<div className='HomeView container'>
				<HomeFormContainer />
				<ListContainer
					list={this.props.list}
					userSettings={this.props.userState.userSettings}
				/>
			</div>
		);
	}

}

const mapStateToProps = (store) => {
	return {
		list: store.listState,
		userState: store.userState
	}
}

export default connect(mapStateToProps)(HomeView);