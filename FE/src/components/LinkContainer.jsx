import React, { Component } from 'react';
import { store } from '../store';
import Link from './Link';
import PropTypes from 'prop-types';

class LinkContainer extends Component {

	handleRemoveLink(key, id) {
		store.dispatch({
			"type": "REMOVE_LINK",
			id
		});

		fetch('/api/delete/Thib/' + id, {
				"method": "DELETE",
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			})
			.then(res => res.json())
			.then(res => {});
	}

	handleShowAddTagModal(linkKey, linkId) {
		store.dispatch({
			"type": "SHOW_MODAL",
			linkKey,
			linkId
		});
	};

	render() {
		return (
			<Link
				linkKey={this.props.linkKey}
				linkId={this.props.linkId}
				url={this.props.url}
				title={this.props.title}
				date={this.props.date}
				tags={this.props.tags}
				removeLink={this.handleRemoveLink}
				maxTags={this.props.maxTags}
				showAddTagModal={this.handleShowAddTagModal}
			/>
		)
	}

}

export default LinkContainer;

LinkContainer.propTypes = {
	linkKey: PropTypes.number,
	linkId: PropTypes.string,
	url: PropTypes.string,
	title: PropTypes.string,
	date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
	tags: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		color: PropTypes.string.isRequired
	})),
	maxTags: PropTypes.number.isRequired
}