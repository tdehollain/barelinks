import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ColorButtons extends Component {

	render() {

		return (
			<div className='px-2'>
				<ul className="list-inline d-flex justify-content-around colorItems">
				{
					this.props.tagColors.map((color, index) => {
						return (
							<li
								key={index}
								className={`list-inline-item colorItem rounded-circle${index===this.props.activeColor ? " active" : ""}`}
								style={{background: '#'+ color}}
								onClick={this.props.selectTagColor.bind(this, index)}
								tabIndex={index}
								onKeyPress={this.props.handleKeyPress}
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
	tagColors: PropTypes.arrayOf(PropTypes.string).isRequired,
	activeColor: PropTypes.number.isRequired,
	selectTagColor: PropTypes.func.isRequired
};

export default ColorButtons;