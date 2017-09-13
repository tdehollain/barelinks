import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoTag from 'react-icons/lib/go/tag';
import GoTrashcan from 'react-icons/lib/go/trashcan';

export default class Tag extends Component {

	render() {

		let trashcanSpan = null;
		if(this.props.showTranshcan) {
			trashcanSpan = (
				<span className='trashcanIcon' onClick={this.props.removeTag.bind(this, this.props.linkKey, this.props.tagDetails)}>
					<GoTrashcan />
				</span>
			);
		}
		
		return (
			<span 
				id={'tag' + this.props.tagDetails.index}
				className='tag small'
				style={{background: '#' + this.props.tagDetails.color}}
				onClick={this.props.tagClick.bind(this, this.props.tagDetails)}
			>
				<span className='tagIcon'>
					<GoTag />
				</span>
				<span>
					{this.props.tagDetails.name}
				</span>
				{trashcanSpan}
			</span>
		);
	}
}

Tag.propTypes = {
	linkKey: PropTypes.number,
	tagDetails: PropTypes.shape({
		index: PropTypes.number,
		name: PropTypes.string,
		color: PropTypes.string
	}),
	tagClick: PropTypes.func.isRequired,
	removeTag: PropTypes.func,
	showTranshcan: PropTypes.bool
}