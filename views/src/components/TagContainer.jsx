import React, { Component } from 'react';
import { store } from '../store';
import Tag from './Tag';
import PropTypes from 'prop-types';

class TagContainer extends Component {

	constructor() {
		super();

		this.removeTag = this.removeTag.bind(this);
	}

	removeTag() {
		store.dispatch({
			"type": "REMOVE_TAG",
			"linkId": this.props.linkId,
			"name": this.props.name,
			"color":this.props.color
		});

		fetch('/api/removeTag/Thib/' + this.props.linkId + '/' + this.props.name + '/' + this.props.color, {
			"method": "DELETE",
			"headers": {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		});
	}

	render() {
		return (
			<Tag
				name={this.props.name}
				color={this.props.color}
				removeTag={this.removeTag}
			/>
		);
	}

}

TagContainer.propTypes = {
	linkId: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired
}

export default TagContainer;