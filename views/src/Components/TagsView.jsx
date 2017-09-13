import React, { Component } from 'react';
import CommonTagsWithLink from './CommonTagsWithLink';
import LinksListSearch from './LinksListSearch';
import Tag from './Tag';
import { Route } from 'react-router-dom';

export default class TagsView extends Component {

	constructor() {
		super();

		this.state = {
			"commonTags": [],
			"visibleTags": [],
			"enteredTagName": "",
			"links":[]
		}

		this.handleTagNameChange = this.handleTagNameChange.bind(this);
		this.fetchLinks = this.fetchLinks.bind(this);
	}

	updateCommonTags(done) {
		fetch('/api/getTags/Thib')
			.then(res => res.json())
			.then(tags => {
				this.setState({
					"commonTags": tags.filter(tag => tag.count > 0).sort((a, b) => b.count - a.count)
				});
				done();
			});
	}

	handleTagNameChange(e) {
		this.setState({
			"enteredTagName": e.target.value
		});

		this.setState({
			"visibleTags": 
				this.state.commonTags.
				filter(tag => tag.name.toLowerCase()
					.includes(e.target.value.toLowerCase()))
				.slice(0,50)
		});
	}

	handleTagClick(){

	}

	fetchLinks(tagName) {
		// fetch('/api/getLinksByTagName/' + tagName)
		// return fetch('/api/get/Thib/1/50')
		// 	.then(res => res.json)
		// 	.then(links => {
		// 		console.log(links);
				return (
					<div>
						<span className="ml-4 mt-3 mb-2 d-inline-block">
							<h6 className="h6 d-inline">Showing results for tag: </h6>
							<i>{tagName}</i>
							<hr className="my-1"/>
						</span>
						<LinksListSearch
							list={[]}
							removeLink={this.props.removeLink}
							showAddTagModal={this.props.showAddTagModal}
							removeTag={this.props.removeTag}
							maxTags={this.props.maxTags}
							tagSearched={tagName}
						/>
					</div>
				);
			// })
	}

	componentDidMount() {
		this.updateCommonTags(() => {
			this.setState({
				"visibleTags": this.state.commonTags
			});
		});
	}

	render() {
		return (
			<div className="TagsView container mt-5">
				<input
					className='form-control'
					id='tagsInput'
					type='text' 
					placeholder='Tag name'
					value={this.state.enteredTagName}
					onChange={this.handleTagNameChange}
				/>
				<CommonTagsWithLink
					tags={this.state.visibleTags}
					tagClick={this.handleTagClick}
					useLink={true}
				/>
				<Route path='/tags/:tagName' render={(props) => {
					return this.fetchLinks(props.match.params.tagName)
				}} />
			</div>
		)
	}
}