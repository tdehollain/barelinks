import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import AddTagModal from './AddTagModal';
import tagActions from '../List/Link/Tag/tagActions';
import $ from 'jquery';
import addTagModalActions from './addTagModalActions';

class AddTagModalContainer extends Component {

	constructor() {
		super();

		this.state = {
			enteredTagName: '',
			activeColor: 0,
			commonTags: []
		}

		this.handleChangeEnteredTagName = this.handleChangeEnteredTagName.bind(this);
		this.handleSelectTagColor = this.handleSelectTagColor.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
		this.handleAddTag = this.handleAddTag.bind(this);
	}

	componentDidMount() {
		this.props.loadCommonTags(this.props.username);
	}

	handleChangeEnteredTagName(e) {
		this.setState({
			"enteredTagName": e.target.value
		});

		// update list of displayed tags
		let newTags = this.props.commonTags.filter(tag => {
			return tag.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
		});
		this.setState({ commonTags: newTags.slice(0, this.props.maxTagsToShowInModal) });
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

		return (
			<AddTagModal
				tagClick={this.handleTagClick}
				commonTags={this.state.enteredTagName ? this.state.commonTags.slice(0, this.props.maxTagsToShowInModal) : this.props.commonTags.slice(0, this.props.maxTagsToShowInModal)}
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
		commonTags: store.listReducer.commonTags,
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

