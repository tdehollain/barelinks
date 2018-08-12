import React from 'react';
import PropTypes from 'prop-types';

const HomeForm = ({ enteredURL, handleChange, handleSubmit }) =>
	<div className='HomeForm'>
		<form className='form form-row' onSubmit={handleSubmit}>
			<div className='col'>
				<input
					className='form-control'
					id='urlInput'
					type='url'
					placeholder='Enter URL (incl. http)'
					value={enteredURL}
					onChange={handleChange}
				/>
			</div>

			<button
				className='form-control col-2 ml-1 ml-md-2 ml-lg-3 ml-xl-3 btn btn-outline-dark'
				type='submit'>
				Add
					</button>
		</form>
	</div>

HomeForm.propTypes = {
	enteredURL: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired
};

export default HomeForm;