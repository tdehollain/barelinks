import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import TagsFormContainer from './TagsForm/TagsFormContainer';
import TagsViewContainer from './TagsView/TagsViewContainer';
import AddTagModalContainer from "../AddTagModal/AddTagModalContainer";
import listActions from '../HomePage/List/listActions';

class TagsPage extends Component {

	componentDidMount() {
		this.props.loadCommonTags(this.props.username);
	}

	render() {
		return (
			<div className='TagsPage container mt-5'>
				<TagsFormContainer />
				<Route path='/tags/:tagName/:tagColor' component={TagsViewContainer} />
				<AddTagModalContainer
					commonTags={this.props.commonTags}
				/>
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		username: store.userReducer.username,
		commonTags: store.listReducer.commonTags
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		loadCommonTags: (username) => dispatch(listActions.loadCommonTags(username))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsPage);