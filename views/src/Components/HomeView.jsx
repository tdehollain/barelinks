import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainForm from './MainForm';
import LinksList from './LinksList';

export default class HomeView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			"enteredURL": ""
		};
	}

	render() {
		return (
			<div className='MainView container'>
				<MainForm
					handleSubmit={this.props.handleSubmit}
				/>
				<LinksList 
					list={this.props.list}
					removeLink={this.props.removeLink}
					showAddTagModal={this.props.showAddTagModal}
					removeTag={this.props.removeTag}
					maxTags={this.props.maxTags}
				/>
			</div>
		);
	}
}

HomeView.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	removeLink: PropTypes.func.isRequired,
	showAddTagModal: PropTypes.func.isRequired,
	removeTag: PropTypes.func.isRequired,
	maxTags: PropTypes.number.isRequired,
	list: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		url: PropTypes.string,
		title: PropTypes.string,
		date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
		tags: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			color: PropTypes.string.isRequired
		}))
	}))
}