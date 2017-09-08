import React, { Component } from 'react';
import GoTag from 'react-icons/lib/go/tag';
import GoTrashcan from 'react-icons/lib/go/trashcan';

export default class Tag extends Component {

	render() {

		return (
			<span 
				id={'tag' + this.props.tagDetails.index}
				className='tag small'
				style={{background: '#' + this.props.tagDetails.color}}
			>
				<span className='tagIcon'>
					<GoTag />
				</span>
				<a href={'/tag/' + this.props.tagDetails.name}>
					{this.props.tagDetails.name}
				</a>
				<span className='trashcanIcon' onClick={this.props.removeTag.bind(this, this.props.linkKey, this.props.tagDetails.index, this.props.tagDetails.name, this.props.tagDetails.color)}>
					<GoTrashcan />
				</span>
			</span>
		);
	}
}