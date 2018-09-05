import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import GoTag from 'react-icons/lib/go/tag';

// const CommonTag = (name, color, tagClick) =>
class CommonTag extends Component {
	render() {
		return (
			<span
				className='tag small'
				style={{ background: this.props.color }}
				onClick={this.props.tagClick.bind(this, this.props.name, this.props.color)}
			>
				<span className='tagIcon'>
					<GoTag />
				</span>
				<span>{this.props.name}</span>
			</span >
		)
	}
}


// CommonTag.propTypes = {
// 	name: PropTypes.string.isRequired,
// 	color: PropTypes.string.isRequired
// }

export default CommonTag;