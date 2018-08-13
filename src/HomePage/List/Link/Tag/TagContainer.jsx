import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tag from './Tag';
import tagActions from './tagActions';
// import PropTypes from 'prop-types';

class TagContainer extends Component {

	constructor() {
		super();
		this.removeTag = this.removeTag.bind(this);
	}

	async removeTag() {
		let tagDetails = {
			"linkId": this.props.linkId,
			"tagName": this.props.name,
			"tagColor": this.props.color
		}
		this.props.removeTag(this.props.username, tagDetails);
	}

	render() {
		return (
			<Tag
				name={this.props.name}
				color={this.props.color}
				removeTag={this.removeTag}
			/>
		);
	}

}

// TagContainer.propTypes = {
// 	linkId: PropTypes.string.isRequired,
// 	name: PropTypes.string.isRequired,
// 	color: PropTypes.string.isRequired
// }

const mapStateToProps = (store) => {
	return {
		username: store.userReducer.username
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		removeTag: (username, tagDetails) => dispatch(tagActions.removeTag(username, tagDetails))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(TagContainer);