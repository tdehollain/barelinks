import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkTags from './LinkTags';
import { formatDate, showYear } from '../helpers/Utils.js'

export default class Link extends Component {

	render() {
		return (
			<li id={this.props.link._id}>
				<button
					type='button'
					className='delBtn btn btn-danger'
					onClick={this.props.removeLink.bind(this, this.props.linkKey, this.props.link._id)}>
						&times;
				</button>
				<span className="small font-italic mx-1 mt-0">{formatDate(new Date(this.props.link.date), showYear(new Date(this.props.link.date)))}</span>
				<a 
					className='link' 
					id={'link_' + this.props.linkKey}
					href={this.props.link.url}>{this.props.link.title.trim()}
				</a>
				<LinkTags 
					linkKey={this.props.linkKey}
					linkId={this.props.link._id}
					showAddTagModal={this.props.showAddTagModal}
					removeTag={this.props.removeTag}
					tags={this.props.link.tags}
					maxTags={this.props.maxTags}
				/>
			</li>
		);
	}
}

Link.propTypes = {
	removeLink: PropTypes.func.isRequired,
	removeTag: PropTypes.func.isRequired,
	maxTags: PropTypes.number.isRequired,
	showAddTagModal: PropTypes.func.isRequired,
	linkKey: PropTypes.number.isRequired,
	link: PropTypes.shape({
		_id: PropTypes.string,
		url: PropTypes.string,
		title: PropTypes.string,
		date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
		tags: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			color: PropTypes.string.isRequired
		})),
	})
};