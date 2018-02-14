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
		store.dispatch({ "type": 'RESET_LIST' });
	}

	componentDidMount() {
		// get list
		this.API_updateList(1);
		// reset active page to 1
		store.dispatch({
			"type": 'RESET_PAGE',
		});

		this.setState({ "tagName": this.props.match.params.tagName });
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.list.page !== this.props.list.page) {
			this.API_updateList(nextProps.list.page);
		}
	}	

	API_updateList(page){
		fetch('/api/getLinksByTagName/Thib/' + this.props.match.params.tagName + '/' + page + '/' + this.props.userSettings.linksPerPage)
			.then(res => res.json())
			.then(res => {
				// update list of links
				store.dispatch({
					"type": 'UPDATE_LIST',
					"list": res.list,
					"count": res.totalCount
				});
				// get color of the current tag
				for(let link of res.list) {
					for(let tag of link.tags) {
						if(tag.name === this.props.match.params.tagName) this.setState({ "tagColor": tag.color});
					}
				}
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