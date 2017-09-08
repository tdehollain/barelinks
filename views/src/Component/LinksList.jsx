import React, { Component } from 'react';
import Link from './Link';

export default class LinksList extends Component {

	render() {
		return (
			<div className='LinksList'>
				<ul className='pl-1'>
					{
						this.props.list.map((elem, index) => {
							return (
								<Link
									key={index}
									index={index}
									elem={elem}
									removeLink={this.props.removeLink}
									removeTag={this.props.removeTag}
									showAddTagModal={this.props.showAddTagModal}
									maxTags={this.props.maxTags}
								/>
							)
						})
					}
				</ul>
			</div>
		);
	}
}