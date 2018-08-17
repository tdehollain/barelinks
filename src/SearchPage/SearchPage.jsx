import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import TagsForm from '../TagsPage/TagsForm/TagsForm';
import SearchViewContainer from './SearchView/SearchViewContainer';
import AddTagModalContainer from "../AddTagModal/AddTagModalContainer";
import listActions from '../HomePage/List/listActions';

class SearchPage extends Component {
	constructor() {
		super();

		this.state = {
			enteredValue: ''
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		// update search string
		this.setState({ "enteredValue": e.target.value });
		this.props.history.push('/search/' + e.target.value);
	}

	componentDidMount() {
		this.props.loadCommonTags(this.props.username);
	}

	render() {
		return (
			<div className='SearchPage container mt-5'>
				<TagsForm
					handleChange={this.handleChange}
					enteredValue={this.state.enteredValue}
					placeholder={'Search...'}
				/>
				<Route path='/search/:searchTerm' component={SearchViewContainer} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);