import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

export default class MainForm extends Component {

	constructor() {
		super();

		this.state = {
			"enteredURL": ""
		}

		this.handleURLchange = this.handleURLchange.bind(this);
		// this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleURLchange(e) {
		this.setState({ 
			"enteredURL": e.target.value
		});
	}

	handleFormSubmit(e) {
		e.preventDefault();
		this.props.handleSubmit(this.state.enteredURL);

		// Empty form
		this.setState({ 
			"enteredURL": ""
		});
	}

	componentDidMount() {
		$('#urlInput').focus();
	}

	render() {
		return (
			<div className='MainForm'>
				<form className='form form-row' onSubmit={e => this.handleFormSubmit(e)}>
					<div className='col'>
						<input
							className='form-control'
							id='urlInput'
							type='url' 
							placeholder='Enter URL (incl. http)'
							value={this.state.enteredURL}
							onChange={this.handleURLchange}
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

MainForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired
};
