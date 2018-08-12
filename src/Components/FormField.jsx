import React from 'react';

const FormField = ({ id, type, label, value, handleChange, errorMessage }) =>
	<div className="form-group">
		<label className='mb-1'>{label}</label>
		<input
			type={type}
			className={"form-control" + (errorMessage ? ' validationError' : '')}
			id={id}
			onChange={handleChange}
			value={value}
			required
		/>
		{errorMessage && <div className={'errorMessage'}>{errorMessage}</div>}
	</div>

export default FormField;