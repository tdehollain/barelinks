import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tag from './Tag';

export default class CommonTags extends Component {

	render() {

		return(
			<div className="tags my-3">
			{
				this.props.tags.map((tag, index) => {

					return (
						<Tag 
							key={index}
							linkKey={this.props.linkKey}
							tagDetails={{ index: index, name: tag.name, color: tag.color }}
							tagClick={this.props.tagClick}
							showTranshcan={false}
						/>
					)
				})
			}
			</div>
		)
	}
}

CommonTags.propTypes = {
	linkKey: PropTypes.number.isRequired,
	tags: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		color: PropTypes.string.isRequired
	})),
	tagClick: PropTypes.func.isRequired
};