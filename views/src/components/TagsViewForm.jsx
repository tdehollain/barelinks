import React, { Component } from 'react';

class TagsViewForm extends Component {
	render() {
		return (
			<div className='TagsViewForm mt-5 ml-1'>
				<form className='form form-row' onSubmit={e => e.preventDefault()}>
					<input
						className='form-control'
						id='tagNameInput'
						type='text'
						placeholder={this.props.placeholder}
						value={this.props.enteredValue}
						onChange={this.props.handleChange}
					/>
				</form>
			</div>
		);
	}
}

export default TagsViewForm;