import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import List from './List';

class ListContainer extends Component {

	componentDidMount() {
		fetch('/api/get/Thib/1/50')
			.then(res => res.json())
			.then(res => {
				store.dispatch({
					"type": 'UPDATE_LIST',
					"list": res.list
				});
			});
	}

	render() {
		return (
			<List 
				list={this.props.list}
				maxTags={this.props.userSettings.maxTags}
			/>
		);
	}

}

const mapStateToProps = (store) => {
	return {
		list: store.listState.visibleList,
		userSettings: store.userState.userSettings
	}
}

export default connect(mapStateToProps)(ListContainer);