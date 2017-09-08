import React, { Component } from 'react';
import AddTagButton from './AddTagButton';
import Tag from './Tag';

export default class LinkTags extends Component {

	render() {

		return (
			<span className={'tags'}>
				{
					this.props.tags.map((tag, index) => {
						return (
							<Tag 
								key={index}
								linkKey={this.props.linkKey}
								tagDetails={{ index: index, name: tag.name, color: tag.color }}
								removeTag={this.props.removeTag}
							/>
						);
					})
				}
				{
					this.props.tags.length < this.props.maxTags &&
						<AddTagButton 
							showAddTagModal={this.props.showAddTagModal}
							linkKey={this.props.linkKey}
							linkId={this.props.linkId}
						/>
				}
			</span>
		);
	}
}