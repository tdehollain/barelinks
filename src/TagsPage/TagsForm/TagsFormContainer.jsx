import React, { Component } from 'react';
import { connect } from 'react-redux';
import TagsForm from './TagsForm';
import TagsFormTags from './TagsFormTags';
import history from '../../helpers/history/history';

class TagsFormContainer extends Component {
	constructor() {
		super();

		this.state = {
			enteredValue: '',
			tags: []
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
	}

	handleChange(e) {
		// update search string
		this.setState({ "enteredValue": e.target.value });

		// update list of displayed tags
		let newTags = this.props.list.commonTags.filter(tag => {
			return tag.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
		});
		this.setState({ "tags": newTags.slice(0, this.props.userSettings.maxTagsToShow) });
	}

	handleTagClick(name, color) {
		history.push('/tags/' + name + '/' + color.slice(-6));
	}

	render() {

		return (
			<div className='TagsFormContainer container mb-5'>
				<TagsForm
					handleChange={this.handleChange}
					enteredValue={this.state.enteredValue}
					placeholder={'Enter a tag name'}
				/>
				<TagsFormTags
					tags={this.state.tags.length ? this.state.tags : this.props.list.commonTags}
					tagClick={this.handleTagClick}
				/>
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		list: store.listReducer,
		userSettings: store.userReducer.settings
	}
}

export default connect(mapStateToProps)(TagsFormContainer);