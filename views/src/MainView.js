import React, { Component } from 'react';
// import $ from 'jquery';

import MainForm from './MainForm';
import LinksList from './LinksList';
import AddTagModal from './AddTagModal';
import { URLisValid, immutableDelete } from './Utils.js';

class MainView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			"enteredURL": "",
			"currentModal_linkKey": "",
			"currentModal_linkId": "",
			"links": [],
			"commonTags": []
		};

		this.handleURLchange = this.handleURLchange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleShowAddTagModal = this.handleShowAddTagModal.bind(this);
		this.handleAddTag = this.handleAddTag.bind(this);
		this.handleRemoveTag = this.handleRemoveTag.bind(this);
		this.updateCommonTags = this.updateCommonTags.bind(this);
	}

	handleURLchange(e) {
		this.setState({ 
			"enteredURL": e.target.value
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		if(URLisValid(this.state.enteredURL)) {
			this.setState({
				"links": [{
					"url": this.state.enteredURL,
					"title": this.state.enteredURL,
					"date": new Date(),
					"tags": []
				},...this.state.links]
			});
		}

		// empty form
		this.setState({
			"enteredURL": ""
		});

		fetch("/api/add/Thib/" + encodeURIComponent(this.state.enteredURL) + '/' + new Date(), {
			"method": "GET",
			"headers": {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		})
		.then((res) => res.json())
		.then(res => {

			let currentLinks = this.state.links;

			let newLink = {
				date: currentLinks[0].date,
				url: currentLinks[0].url,
				title: res.title
			}

			let newLinks = [newLink, ...currentLinks.slice(1)]

			this.setState({
				"links": newLinks
			});

		});
	}

	handleRemove(item, id) {
		fetch('/api/delete/Thib/' + id, {
				"method": "DELETE",
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			})
		.then((res) => res.json());

		this.setState({ 
			"links": immutableDelete(this.state.links, item)
		});
	}

	handleShowAddTagModal(key, id) {
		this.setState({
			"currentModal_linkKey": key,
			"currentModal_linkId": id
		});
	}

	handleAddTag(tag) {
		let linkKey = this.state.currentModal_linkKey;
		// let linkId = this.state.currentModal_linkId;

		let currentLinks = this.state.links;
		let elementToUpdate = this.state.links[linkKey];

		// abort if tag already present
		let tagAlreadyPresent = false;
		elementToUpdate.tags.map((item, index) => {
			if(item.name === tag.name && item.color === tag.color) {
				tagAlreadyPresent = true;
			}
		});

		if(!tagAlreadyPresent) {
			let linksArrBefore = currentLinks.slice(0, linkKey);
			let linksArrAfter = currentLinks.slice(linkKey + 1);

			let newTags = elementToUpdate.tags ? [...elementToUpdate.tags, tag] : [tag];

			let newLink = {
				"_id": elementToUpdate._id,
				"url": elementToUpdate.url,
				"title": elementToUpdate.title,
				"date": elementToUpdate.date,
				"tags": newTags
			}

			let newLinksArr = [...linksArrBefore, newLink, ...linksArrAfter];
			
			this.setState({
				"links": newLinksArr
			});


			let addTagUrl = '/api/addTag/Thib/' + elementToUpdate._id + '/' + encodeURIComponent(tag.name) + '/' + tag.color; 
			fetch(addTagUrl, {
					"method": "GET",
					"headers": {
						"Accept": "application/json",
						"Content-Type": "application/json"
					}
				})
			.then((res) => res.json())
			.then(this.updateCommonTags);
		}
	}

	handleRemoveTag (linkKey, tagIndex, tagName, tagColor) {
		let currentLinks = this.state.links;
		let elementToUpdate = this.state.links[linkKey];
		let linksArrBefore = currentLinks.slice(0, linkKey);
		let linksArrAfter = currentLinks.slice(linkKey + 1);

		let newTags = immutableDelete(elementToUpdate.tags, tagIndex);
		
		let newLink = {
				"_id": elementToUpdate._id,
				"url": elementToUpdate.url,
				"title": elementToUpdate.title,
				"date": elementToUpdate.date,
				"tags": newTags
			}


		let newLinksArr = [...linksArrBefore, newLink, ...linksArrAfter];
		
		this.setState({
			"links": newLinksArr
		});

		let removeTagUrl = '/api/removeTag/Thib/' + elementToUpdate._id + '/' + tagName + '/' + tagColor; 

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

	updateLinks() {
		fetch('/api/get/Thib/1/50')
			.then(res => res.json())
			.then(res => {
				this.setState({
					"links": res.list
				});
			});
	}

	updateCommonTags() {
		fetch('api/getCommonTags/Thib')
			.then(res => res.json())
			.then(tags => {
				this.setState({
					"commonTags": tags.filter(tag => tag.count > 0).sort((a, b) => b.count - a.count).slice(0,10)
				});
			});
	}

	componentDidMount() {
		this.updateLinks();
		this.updateCommonTags();
	}

	render() {
		return (
			<div className='MainView container'>
				<MainForm
					URLvalue={this.state.enteredURL}
					handleURLchange={this.handleURLchange} 
					handleSubmit={this.handleSubmit}
				/>
				<LinksList 
					list={this.state.links}
					removeLink={this.handleRemove}
					showAddTagModal={this.handleShowAddTagModal}
					removeTag={this.handleRemoveTag}
				/>
				<AddTagModal 
					linkId={this.state.currentModal_linkId}
					linkKey={this.state.currentModal_linkKey}
					addTag={this.handleAddTag}
					commonTags={this.state.commonTags}
				/>
			</div>
		);
	}
}

export default MainView;