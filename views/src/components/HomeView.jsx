import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import HomeFormContainer from './HomeFormContainer';
import ListContainer from './ListContainer';

class HomeView extends Component {

	componentDidMount() {
		this.API_updateList(this.props.list.page);
		this.API_getTags();
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
					"count": res.totalCount
				});
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
					userSettings={this.props.userSettings}
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

export default connect(mapStateToProps)(HomeView);