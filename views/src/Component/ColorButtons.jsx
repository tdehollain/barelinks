import React, { Component } from 'react';

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
								onKeyPress={this.props.handleKeyPress}
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