import React, { Component } from 'react';
import TagContainer from '../../HomePage/List/Link/Tag/TagContainer';

class TagsFormTags extends Component {

	render() {
		return (
			<div className='mt-3'>
				{this.props.tags.map((tag, index) => {
					return (
						<TagContainer
							key={index}
							name={tag.name}
							color={tag.color}
							showDeleteButton={false}
						/>
					)
				})}
			</div>
		);
	}
}

export default TagsFormTags;