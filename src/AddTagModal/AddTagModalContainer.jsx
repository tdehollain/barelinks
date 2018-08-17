import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import AddTagModal from './AddTagModal';
import tagActions from '../HomePage/List/Link/Tag/tagActions';
import $ from 'jquery';
import addTagModalActions from './addTagModalActions';

class AddTagModalContainer extends Component {

	constructor() {
		super();

		this.state = {
			enteredTagName: '',
			activeColor: 0
		}

		this.handleChangeEnteredTagName = this.handleChangeEnteredTagName.bind(this);
		this.handleSelectTagColor = this.handleSelectTagColor.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
		this.handleAddTag = this.handleAddTag.bind(this);
	}

	handleChangeEnteredTagName(e) {
		this.setState({
			"enteredTagName": e.target.value
		});
	}

	handleSelectTagColor(key) {
		this.setState({
			"activeColor": key
		});
	}

	handleTagClick(name, color) {
		this.setState({
			"enteredTagName": name,
			"activeColor": this.props.tagColors.indexOf(color.toUpperCase())
		}, () => {
			this.handleAddTag();
			$('#addTagSubmitButton').click();
		});
	}

	async handleAddTag() {
		if (this.state.enteredTagName) {
			let tagDetails = {
				"linkId": this.props.linkId,
				"tagName": this.state.enteredTagName,
				"tagColor": this.props.tagColors[this.state.activeColor]
			};

			this.props.addTag(this.props.username, tagDetails);

			this.setState({
				"enteredTagName": '',
				"activeColor": 0,
				"commonTags": this.props.commonTags.slice(0, this.props.maxTagsToShowInModal)
			});
		}
	}

	render() {

		let commonTagsFiltered = this.props.commonTags.filter(tag => {
			return tag.name.toLowerCase().indexOf(this.state.enteredTagName.toLowerCase()) > -1;
		});
		let commonTagsToShow = this.state.enteredTagName
			? commonTagsFiltered.slice(0, this.props.maxTagsToShowInModal)
			: this.props.commonTags.slice(0, this.props.maxTagsToShowInModal)

		return (
			<AddTagModal
				tagClick={this.handleTagClick}
				commonTags={commonTagsToShow}
				enteredTagName={this.state.enteredTagName}
				changeEnteredTagName={this.handleChangeEnteredTagName}
				tagColors={this.props.tagColors}
				addTag={this.handleAddTag}
				activeColor={this.state.activeColor}
				selectTagColor={this.handleSelectTagColor}
			/>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		username: store.userReducer.username,
		maxTagsToShowInModal: store.userReducer.settings.maxTagsToShowInModal,
		tagColors: store.userReducer.tagColors,
		linkId: store.addTagModalReducer.linkId
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		addTag: (username, tagDetails) => dispatch(tagActions.addTag(username, tagDetails)),
		loadCommonTags: (username) => dispatch(addTagModalActions.loadCommonTags(username))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTagModalContainer);

