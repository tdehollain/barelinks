import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

export default class LinksListSearch extends Component {

	constructor() {
		super();

		this.state = {
			list: []
		}
	}

	updateList() {
		fetch('/api/getLinksByTagName/Thib/' + this.props.tagSearched + '/1/50')
			.then(res => res.json())
			.then(res => {
				this.setState({
					list: res.list
				});
			});
	}

	componentDidUpdate() {
		this.updateList();
	}

	componentDidMount() {
		this.updateList();
	}

	render() {
		return (
			<div className='LinksList'>
				<ul className='pl-1'>
					{
						this.state.list.map((link, index) => {
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

LinksListSearch.propTypes = {
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