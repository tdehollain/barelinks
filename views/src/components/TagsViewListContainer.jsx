import React, { Component } from 'react';
import { store } from '../store';
import { connect } from 'react-redux';
import ListContainer from './ListContainer';
import CommonTag from './CommonTag';

class TagsViewListContainer extends Component {

	constructor() {
		super();
		this.state = {
			"tagName": '',
			"tagColor": ''
		}
	}

	componentWillMount() {
		// console.log('componentWillMount');
		store.dispatch({ "type": 'RESET_LIST' });
	}

	componentDidMount() {
		// console.log('componentDidMount');
		this.resetList(this.props.match.params.tagName);
	}

	componentWillReceiveProps(nextProps) {
		// console.log('componentWillReceiveProps');
		if(nextProps.list.page !== this.props.list.page) {
			this.API_updateList(nextProps.match.params.tagName, nextProps.list.page);
		}

		if(nextProps.match.params.tagName !== this.props.match.params.tagName) {
			this.resetList(nextProps.match.params.tagName);
		}
	}

	resetList(tagName) {
		// get list
		this.API_updateList(tagName, 1);
		this.setState({ "tagName": tagName });
		// get color of the current tag
		for(let tag of this.props.tagList) {
			if(tag.name === tagName) this.setState({ "tagColor": tag.color});
		}
	}

	API_updateList(tagName, page){
		fetch('/api/getLinksByTagName/Thib/' + tagName + '/' + page + '/' + this.props.userSettings.linksPerPage)
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
					<span><u>Showing results for tag</u> </span>
					<CommonTag 
							key={1} 
							name={this.state.tagName} 
							color={this.state.tagColor}
							tagClick={() => {}}
						/>
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

export default connect(mapStateToProps)(TagsViewListContainer);