import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import Link from './Link';
import API from '../helpers/API';
import PropTypes from 'prop-types';

class LinkContainer extends Component {

	constructor() {
		super();

		this.handleRemoveLink = this.handleRemoveLink.bind(this);
	}

	async handleRemoveLink(key, id) {
		store.dispatch({
			"type": "REMOVE_LINK",
			id
		});
		let res = await API.deleteLink(this.props.userState.username, id);
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

const mapStateToProps = (store) => { return { userState: store.userState } };

export default connect(mapStateToProps)(LinkContainer);

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