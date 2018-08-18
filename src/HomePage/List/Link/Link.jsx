import React, { Component } from 'react';
import TagContainer from './Tag/TagContainer';
// import PropTypes from 'prop-types';
import { formatDate, showYear } from '../../../utils/util.js'

class Link extends Component {

	render() {
		return (
			<li>
				<button
					type='button'
					className='delBtn btn btn-danger'
					onClick={this.props.removeLink.bind(this, this.props.linkId)}>
					&times;
				</button>
				<span className="small font-italic mx-1 mt-0">{formatDate(new Date(this.props.date), showYear(new Date(this.props.date)))}</span>
				<a
					className='link'
					href={this.props.url}>{this.props.title.trim()}
				</a>
				{this.props.tags.map((tag, index) => {
					return (
						<TagContainer
							key={index}
							linkId={this.props.linkId}
							name={tag.name}
							color={tag.color}
						/>
					)
				})}
				{
					this.props.tags.length < this.props.maxTags &&
					<div className='d-inline'>
						<button
							type='button'
							className='btn btn-outline-success tag addTagButton'
							data-toggle="modal"
							data-target="#addTagModal"
							onClick={this.props.showAddTagModal.bind(this, this.props.linkKey, this.props.linkId)}
						>
							+
							</button>
					</div>
				}
			</li>
		)
	}

}

export default Link;

// Link.propTypes = {
// 	linkKey: PropTypes.number.isRequired,
// 	linkId: PropTypes.string, // not required because it exists only after added to the DB
// 	url: PropTypes.string.isRequired,
// 	title: PropTypes.string.isRequired,
// 	date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
// 	tags: PropTypes.arrayOf(PropTypes.shape({
// 		name: PropTypes.string.isRequired,
// 		color: PropTypes.string.isRequired
// 	})),
// 	removeLink: PropTypes.func,
// 	maxTags: PropTypes.number.isRequired,
// 	showAddTagModal: PropTypes.func.isRequired
// }