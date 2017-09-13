import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

export default class LinksList extends Component {

	render() {
		return (
			<div className='LinksList'>
				<ul className='pl-1'>
					{
						this.props.list.map((link, index) => {
							return (
								<Link
									key={index}
									linkKey={index}
									link={link}
									removeLink={this.props.removeLink}
									removeTag={this.props.removeTag}
									showAddTagModal={this.props.showAddTagModal}
									maxTags={this.props.maxTags}
								/>
							)
						})
					}
				</ul>
			</div>
		);
	}
}

LinksList.propTypes = {
	removeLink: PropTypes.func.isRequired,
	removeTag: PropTypes.func.isRequired,
	maxTags: PropTypes.number.isRequired,
	showAddTagModal: PropTypes.func.isRequired,
	list: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		url: PropTypes.string,
		title: PropTypes.string,
		date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
		tags: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			color: PropTypes.string.isRequired
		}))
	})).isRequired
};