import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import { Route } from 'react-router-dom';
import tagsPageActions from './tagsPageActions';
import TagsViewForm from './TagsViewForm';
import TagsViewTags from './TagsViewTags';
import TagsViewListContainer from './TagsViewListContainer';

class TagsViewContainer extends Component {
	constructor() {
		super();

		this.state = {
			enteredValue: '',
			tags: []
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
	}

	componentDidMount() {
		this.props.resetList(this.props.username);
	}

	handleChange(e) {
		// update search string
		this.setState({ "enteredValue": e.target.value });

		// update list of displayed tags
		let newTags = this.props.list.commonTags.filter(tag => {
			return tag.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
		});
		this.setState({ "tags": newTags.slice(0, this.props.userSettings.maxTagsToShow) });
	}

	handleTagClick(name, color) {
		this.props.history.push('/tags/' + name);
	}

	render() {

		return (
			<div className='TagsPage container'>
				<TagsViewForm
					handleChange={this.handleChange}
					enteredValue={this.state.enteredValue}
					placeholder={'Enter a tag name'}
				/>
				<TagsViewTags
					tags={this.state.tags}
					tagClick={this.handleTagClick}
				/>
				{/* <Route path='/tags/:tagName/' component={TagsViewListContainer} /> */}
				<Route path='/tags/:tagName/' render={(props) => <TagsViewListContainer tagList={this.state.tags} {...props} />} />
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		list: store.listReducer,
		username: store.userReducer.username,
		userSettings: store.userReducer.settings
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		resetList: (username) => dispatch(tagsPageActions.resetList(username))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsViewContainer);