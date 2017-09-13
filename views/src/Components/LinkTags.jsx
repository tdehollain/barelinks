import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddTagButton from './AddTagButton';
import Tag from './Tag';

export default class LinkTags extends Component {

	handleTagClick() {
		
	}

	render() {

		return (
			<span className={'tags'}>
				{
					this.props.tags.map((tag, index) => {
						return (
							<Tag 
								key={index}
								linkKey={this.props.linkKey}
								tagDetails={{ index: index, name: tag.name, color: tag.color }}
								removeTag={this.props.removeTag}
								tagClick={this.handleTagClick}
								showTranshcan={true}
							/>
						);
					})
				}
				{
					this.props.tags.length < this.props.maxTags &&
						<AddTagButton 
							showAddTagModal={this.props.showAddTagModal}
							linkKey={this.props.linkKey}
							linkId={this.props.linkId}
						/>
				}
			</span>
		);
	}
}

LinkTags.propTypes = {
	removeTag: PropTypes.func.isRequired,
	tags: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		color: PropTypes.string.isRequired
	})),
	maxTags: PropTypes.number.isRequired,
	showAddTagModal: PropTypes.func.isRequired,
	linkKey: PropTypes.number.isRequired,
	linkId: PropTypes.string
};