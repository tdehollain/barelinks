import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HomeView from './HomeView';
import TagsView from './TagsView';
import AddTagModal from './AddTagModal';
import { Switch, Route } from 'react-router-dom';
import { URLisValid, immutableDelete } from '../helpers/Utils.js';

export default class MainView extends Component {

	constructor() {
		super();

		this.state = {
			tagColors: ['#B0BEC5','#BCAAA4','#FFCC80','#FFF59D','#C5E1A5','#80CBC4','#81D4FA','#9FA8DA','#CE93D8','#EF9A9A'],
			"commonTags": [],
			"list": [],
			"currentModal_linkKey": -1,
			"currentModal_linkId": ""
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRemoveLink = this.handleRemoveLink.bind(this);
		this.handleAddTag = this.handleAddTag.bind(this);
		this.handleRemoveTag = this.handleRemoveTag.bind(this);
		this.updateCommonTags = this.updateCommonTags.bind(this);
		this.handleShowAddTagModal = this.handleShowAddTagModal.bind(this);
	}

	handleSubmit(url) {
		if(URLisValid(url)) {
			this.setState({
				"list": [{
					"url": url,
					"title": url,
					"date": new Date(),
					"tags": []
				},...this.state.list]
			});
		}

		fetch("/api/add/Thib/" + encodeURIComponent(url) + '/' + new Date(), {
			"method": "PUT",
			"headers": {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		})
		.then((res) => res.json())
		.then(res => {

			let currentList = this.state.list;

			let newLink = {
				date: currentList[0].date,
				url: currentList[0].url,
				title: res.title,
				tags: []
			}

			let newList = [newLink, ...currentList.slice(1)]

			this.setState({
				"list": newList
			});

		});
	}

	handleRemoveLink(item, id) {
		fetch('/api/delete/Thib/' + id, {
				"method": "DELETE",
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			})
		.then((res) => res.json());

		console.log("Item to delete: " + item);

		this.setState({ 
			"list": immutableDelete(this.state.list, item)
		});
	}

	updateList() {
		fetch('/api/get/Thib/1/50')
			.then(res => res.json())
			.then(res => {
				this.setState({
					"list": res.list
				});
			});
	}

	handleAddTag(tag, linkKey) {

		let currentList = this.state.list;
		let elementToUpdate = this.state.list[linkKey];

		// abort if tag already present
		let tagAlreadyPresent = false;
		elementToUpdate.tags.map((item, index) => {
			if(item.name === tag.name && item.color === tag.color) {
				tagAlreadyPresent = true;
			}
		});

		if(!tagAlreadyPresent) {
			let listBefore = currentList.slice(0, linkKey);
			let listAfter = currentList.slice(linkKey + 1);

			let newTags = elementToUpdate.tags ? [...elementToUpdate.tags, tag] : [tag];

			let newLink = {
				"_id": elementToUpdate._id,
				"url": elementToUpdate.url,
				"title": elementToUpdate.title,
				"date": elementToUpdate.date,
				"tags": newTags
			}

			let newList = [...listBefore, newLink, ...listAfter];
			
			this.setState({
				"list": newList
			});


			let addTagUrl = '/api/addTag/Thib/' + elementToUpdate._id + '/' + encodeURIComponent(tag.name) + '/' + tag.color; 
			fetch(addTagUrl, {
					"method": "PUT",
					"headers": {
						"Accept": "application/json",
						"Content-Type": "application/json"
					}
				})
			.then((res) => res.json())
			.then(this.updateCommonTags);
		}
	}

	handleRemoveTag (linkKey, tagDetails) {
		let currentList = this.state.list;
		let elementToUpdate = this.state.list[linkKey];
		let listBefore = currentList.slice(0, linkKey);
		let listAfter = currentList.slice(linkKey + 1);

		let newTags = immutableDelete(elementToUpdate.tags, tagDetails.index);
		
		let newLink = {
				"_id": elementToUpdate._id,
				"url": elementToUpdate.url,
				"title": elementToUpdate.title,
				"date": elementToUpdate.date,
				"tags": newTags
			}


		let newList = [...listBefore, newLink, ...listAfter];
		
		this.setState({
			"list": newList
		});

		let removeTagUrl = '/api/removeTag/Thib/' + elementToUpdate._id + '/' + tagDetails.name + '/' + tagDetails.color; 

		fetch(removeTagUrl, {
				"method": "DELETE",
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			})
		.then((res) => res.json())
		.then(this.updateCommonTags);
	}

	handleShowAddTagModal(key, id) {
		this.setState({
			"currentModal_linkKey": key,
			"currentModal_linkId": id
		});
	}

	updateCommonTags() {
		fetch('/api/getTags/Thib')
			.then(res => res.json())
			.then(tags => {
				this.setState({
					"commonTags": tags.filter(tag => tag.count > 0).sort((a, b) => b.count - a.count)
				});
			});
	}

	componentDidMount() {
		this.updateList();
		this.updateCommonTags();
	}

	render() {
		return (
			<div>
				<Switch>
					<Route exact path='/' render={(props) => (
						<HomeView
							list={this.state.list}
							commonTags={this.state.commonTags}
							removeLink={this.handleRemoveLink}
							removeTag={this.handleRemoveTag}
							handleSubmit={this.handleSubmit}
							maxTags={3}
							showAddTagModal={this.handleShowAddTagModal}
							addTag={this.handleAddTag}
							tagColors={this.state.tagColors}
						/>
					)} />
					<Route path='/tags' render={(props) => (
						<TagsView
							list={this.state.list}
							commonTags={this.state.commonTags}
							removeLink={this.handleRemoveLink}
							removeTag={this.handleRemoveTag}
							maxTags={3}
							showAddTagModal={this.handleShowAddTagModal}
							tagColors={this.state.tagColors}
						/>
					)} />
				</Switch>
				<AddTagModal 
					linkId={this.state.currentModal_linkId}
					linkKey={this.state.currentModal_linkKey}
					addTag={this.handleAddTag}
					commonTags={this.state.commonTags}
					tagColors={this.state.tagColors}
				/>
			</div>
		)
	}
}