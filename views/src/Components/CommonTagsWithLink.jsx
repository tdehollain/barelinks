import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tag from './Tag';

export default class CommonTagsWithLink extends Component {

	render() {

		return(
			<div className="tags my-3">
			{
				this.props.tags.map((tag, index) => {

					return (
						<Link 
							key={index}
							to={'/tags/' + encodeURIComponent(tag.name)}
						>
							<Tag 
								linkKey={this.props.linkKey}
								tagDetails={{ index: index, name: tag.name, color: tag.color }}
								tagClick={this.props.tagClick}
								showTranshcan={false}
							/>
						</Link>
					)
				})
			}
			</div>
		)
	}
}

CommonTagsWithLink.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		color: PropTypes.string.isRequired
	})),
	tagClick: PropTypes.func.isRequired
};