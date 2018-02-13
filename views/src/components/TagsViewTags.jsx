import React, { Component } from 'react';
import CommonTag from './CommonTag';

class TagsViewTags extends Component {

	render() {
		return (
			<div className='mt-3'>
				{this.props.tags.map((tag, index) => {
					return (
						<CommonTag 
							key={index} 
							name={tag.name} 
							color={tag.color} 
							tagClick={this.props.tagClick} 
						/>
					)
				})}
			</div>
		);
	}
}

export default TagsViewTags;