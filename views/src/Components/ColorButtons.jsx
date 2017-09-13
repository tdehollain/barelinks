import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ColorButtons extends Component {

	render() {

		return (
			<div className='px-3'>
				<ul className="list-inline d-flex justify-content-around colorItems mt-4 mb-1">
				{
					this.props.tagColors.map((color, index) => {
						return (
							<li
								key={index}
								className="list-inline-item colorItem rounded-circle"
								style={{background: color}}
							>
							</li>
						)
					})
				}
				</ul>
			</div>
		)
	}
}

ColorButtons.propTypes = {
	tagColors: PropTypes.arrayOf(PropTypes.string).isRequired
};