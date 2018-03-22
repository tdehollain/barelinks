import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import AddTagModal from './AddTagModal';
import { store } from '../store';
import $ from 'jquery';

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

	componentWillReceiveProps(nextProps) {
		this.setState({ commonTags: nextProps.commonTags.slice(0, nextProps.maxTagsToShowInModal) });
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
		}, () => { $('#addTagSubmitButton').click(); });
	}

	handleAddTag() {
		if(this.state.enteredTagName) {
			store.dispatch({
				"type": "ADD_TAG",
				"linkId": this.props.linkId,
				"name": this.state.enteredTagName,
				"color": this.props.tagColors[this.state.activeColor]
			});

			fetch('/api/addTag/Thib/' + this.props.linkId + '/' + this.state.enteredTagName + '/' + this.props.tagColors[this.state.activeColor], {
				"method": "PUT",
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			});
			this.setState({
				"enteredTagName": '',
				"activeColor": 0
			});
		}
	}

	render() {

		return(
			<AddTagModal
				tagClick={this.handleTagClick}
				commonTags={this.state.commonTags}
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
		commonTags: store.listState.commonTags,
		maxTagsToShowInModal: store.userState.userSettings.maxTagsToShowInModal,
		tagColors: store.userState.tagColors,
		linkId: store.modalState.linkId
	}
};

export default connect(mapStateToProps)(AddTagModalContainer);

