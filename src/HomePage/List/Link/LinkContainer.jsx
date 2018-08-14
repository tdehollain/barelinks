import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from './Link';
import linkActions from './linkActions';
import addTagModalActions from '../../../AddTagModal/addTagModalActions';

class LinkContainer extends Component {

	constructor() {
		super();
		this.handleRemoveLink = this.handleRemoveLink.bind(this);
		this.handleShowAddTagModal = this.handleShowAddTagModal.bind(this);
	}

	handleRemoveLink(linkId) {
		this.props.removeLink(this.props.username, linkId);

	}

	handleShowAddTagModal(linkKey, linkId) {
		this.props.showAddTagModal(linkKey, linkId)
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

const mapDispatchToProps = (dispatch) => {
	return {
		removeLink: (username, linkId) => dispatch(linkActions.removeLink(username, linkId)),
		showAddTagModal: (linkKey, linkId) => dispatch(addTagModalActions.showAddTagModal(linkKey, linkId))
	}
}

const mapStateToProps = (store) => { return { username: store.userReducer.username } };

export default connect(mapStateToProps, mapDispatchToProps)(LinkContainer);

// LinkContainer.propTypes = {
// 	linkKey: PropTypes.number,
// 	linkId: PropTypes.string,
// 	url: PropTypes.string,
// 	title: PropTypes.string,
// 	date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
// 	tags: PropTypes.arrayOf(PropTypes.shape({
// 		name: PropTypes.string.isRequired,
// 		color: PropTypes.string.isRequired
// 	})),
// 	maxTags: PropTypes.number.isRequired
// }