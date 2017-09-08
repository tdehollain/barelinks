import React, { Component } from 'react';
import GoTag from 'react-icons/lib/go/tag';

export default class commonTag extends Component {

	render() {

		return(
			<div className="tags my-3">
			{
				this.props.tags.map((tag, index) => {

					let countSpan = this.props.context==='TagsView' ? <span className='tagCount'>{tag.count} </span> : null;

					return (
						<span 
							key={index}
							id={'tag' + index}
							className='tag commonTag small'
							style={{ background: '#' + tag.color}}
						>
							<span className='tagName'>
								{countSpan}
								<span className='tagIcon'>
									<GoTag />
								</span>
								{tag.name}
							</span>
						</span>
					)
				})
			}
			</div>
		)
	}
}