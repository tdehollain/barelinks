import React, { Component } from 'react';
import CommonTags from './CommonTags';

export default class TagsView extends Component {

	constructor() {
		super();

		this.state = {
			"commonTags": []
		}
	}

	updateCommonTags() {
		fetch('api/getCommonTags/Thib')
			.then(res => res.json())
			.then(tags => {
				this.setState({
					"commonTags": tags.filter(tag => tag.count > 0).sort((a, b) => b.count - a.count)
				});
			});
	}

	componentDidMount() {
		this.updateCommonTags();
	}

	render() {
		return (
			<div className="TagsView container mt-5">
				<CommonTags 
					context='TagsView'
					tags={this.state.commonTags} />
			</div>
		)
	}
}