import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HomeForm extends Component {

	render() {
		return(
			<div className='HomeForm'>
				<form className='form form-row' onSubmit={this.props.addLink}>
					<div className='col'>
						<input
							className='form-control'
							id='urlInput'
							type='url' 
							placeholder='Enter URL (incl. http)'
							value={this.props.enteredURL}
							onChange={this.props.handleURLchange}
						/>
					</div>

					<button 
						className='form-control col-2 ml-1 ml-md-2 ml-lg-3 ml-xl-3 btn btn-outline-dark'
						type='submit'>
						Add
					</button>
				</form>
			</div>
		);
	}

}

HomeForm.propTypes = {
	enteredURL: PropTypes.string.isRequired,
	handleURLchange: PropTypes.func.isRequired,
	addLink: PropTypes.func.isRequired
};

export default HomeForm;