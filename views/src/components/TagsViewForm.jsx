import React, { Component } from 'react';

class TagsViewForm extends Component {
	render() {
		return (
			<div className='TagsViewForm mt-5'>
				<form className='form form-row'>
					<input
						className='form-control'
						id='tagNameInput'
						type='text'
						placeholder='Enter a tag name'
						value={this.props.enteredValue}
						onChange={this.props.handleChange}
					/>
				</form>
			</div>
		);
	}
}

export default TagsViewForm;