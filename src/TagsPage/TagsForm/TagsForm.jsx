import React from 'react';

const TagsForm = ({ placeholder, enteredValue, handleChange }) =>
	<div className='TagsViewForm mt-5 ml-1'>
		<form className='form form-row' onSubmit={e => e.preventDefault()}>
			<input
				className='form-control'
				id='tagNameInput'
				type='text'
				placeholder={placeholder}
				value={enteredValue}
				onChange={handleChange}
			/>
		</form>
	</div>

export default TagsForm;