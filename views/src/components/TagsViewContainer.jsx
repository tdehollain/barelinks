import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import TagsViewForm from './TagsViewForm';
import TagsViewTags from './TagsViewTags';
import ListContainer from './ListContainer';
import CommonTag from './CommonTag';

class TagsViewContainer extends Component {
	constructor() {
		super();
		this.state = {
			enteredValue: '',
			tags:[]
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
	}

	componentDidMount() {
		this.API_getTags();
		// reset active page to 1
		store.dispatch({
			"type": 'RESET_PAGE',
		});
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.list.page !== this.props.list.page) {
			this.API_updateList(nextProps.list.page);
		}
	}	
	
	API_getTags() {
		fetch('/api/getTags/Thib')
			.then(res => res.json())
			.then(res => {
				store.dispatch({
					"type": 'UPDATE_TAGS',
					"tags": res.tags
				});

				// start with full list of tags
				this.setState({ tags: res.tags.slice(0,20) });
			});
	}

	API_updateList(page){
		fetch('/api/getLinksByTagName/Thib/' + this.state.selectedTag.name + '/' + this.state.selectedTag.color + '/' + page + '/' + this.props.userSettings.linksPerPage)
			.then(res => res.json())
			.then(res => {
				// update list of links
				store.dispatch({
					"type": 'UPDATE_LIST',
					"list": res.list,
					"count": res.totalCount
				});
			});
	}

	handleChange(e) {
		// update search string
		this.setState({ "enteredValue": e.target.value });

		// update list of tags
		let newTags = this.props.list.commonTags.filter(tag => {
			return tag.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
		});
		this.setState({ "tags": newTags.slice(0,20)});
	}

	handleTagClick(name, color) {
		this.setState({
			"selectedTag": {
				"name": name,
				"color": color
			}
		}, () => {
			this.API_updateList(1);
		});
	}

	render() {

		let tagList = null;
		if(this.state.selectedTag) {
			tagList = <div className='mt-5'>
									<div className='mb-3'>
										<span><u>Showing results for tag</u> </span>
										<CommonTag 
												key={1} 
												name={this.state.selectedTag.name} 
												color={this.state.selectedTag.color} 
												tagClick={this.handleTagClick} 
											/>
										</div>
									<ListContainer
										userSettings={this.props.userSettings}
										list={this.props.list}
									/>
								</div>
		}

		return (
			<div className='TagsViewContainer container'>
				<TagsViewForm
					handleChange={this.handleChange}
					enteredValue={this.state.enteredValue}
				/>
				<TagsViewTags 
					tags={this.state.tags}
					tagClick = {this.handleTagClick}
				/>
				{tagList}
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		list: store.listState,
		userSettings: store.userState.userSettings
	}
}

export default connect(mapStateToProps)(TagsViewContainer);