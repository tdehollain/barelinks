import React, { Component } from 'react';
import LinkTags from './LinkTags';
import { formatDate, showYear } from '../helpers/Utils.js'

export default class Link extends Component {

	render() {
		return (
			<li id={this.props.elem._id}>
				<button
					type='button'
					className='delBtn btn btn-danger'
					onClick={this.props.removeLink.bind(this, this.props.index, this.props.elem._id)}>
						&times;
				</button>
				<span className="small font-italic mx-1 mt-0">{formatDate(new Date(this.props.elem.date), showYear(new Date(this.props.elem.date)))}</span>
				<a 
					className='link' 
					id={'link_' + this.props.index}
					href={this.props.elem.url}>{this.props.elem.title.trim()}
				</a>
				<LinkTags 
					linkKey={this.props.index}
					linkId={this.props.elem._id}
					showAddTagModal={this.props.showAddTagModal}
					removeTag={this.props.removeTag}
					tags={this.props.elem.tags}
					maxTags={this.props.maxTags}
				/>
			</li>
		);
	}
}