import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import { Route } from 'react-router-dom';
import TagsViewForm from './TagsViewForm';
import TagsViewTags from './TagsViewTags';
import TagsViewListContainer from './TagsViewListContainer';

class TagsViewContainer extends Component {
	constructor() {
		super();
		
		this.state = {
			enteredValue: '',
			tags:[]
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
	}

	componentDidMount() {
		
		this.API_getTags();
		// reset active page to 1
		store.dispatch({
			"type": 'RESET_PAGE',
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

				// start with full list of tags
				this.setState({ tags: res.tags.slice(0,this.props.userSettings.maxTagsToShow) });
			});
	}

	handleChange(e) {
		// update search string
		this.setState({ "enteredValue": e.target.value });

		// update list of tags
		let newTags = this.props.list.commonTags.filter(tag => {
			return tag.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
		});
		this.setState({ "tags": newTags.slice(0,this.props.userSettings.maxTagsToShow)});
	}

	handleTagClick(name, color) {
		this.props.history.push('/tags/' + name);
	}

	render() {

		return (
			<div className='TagsViewContainer container'>
				<TagsViewForm
					handleChange={this.handleChange}
					enteredValue={this.state.enteredValue}
					placeholder={'Enter a tag name'}
				/>
				<TagsViewTags 
					tags={this.state.tags}
					tagClick = {this.handleTagClick}
				/>
				<Route path='/tags/:tagName/' component={TagsViewListContainer} />
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		list: store.listState,
		userSettings: store.userState.userSettings
	}
}

export default connect(mapStateToProps)(TagsViewContainer);