import React, { Component } from 'react';
import $ from 'jquery';

class MainForm extends Component {

	componentDidMount() {
		$('#urlInput').focus();
	}

	render() {
		return (
			<div className='MainForm'>
				<form className='form form-row' onSubmit={e => this.props.handleSubmit(e)}>
					<div className='col'>
						<input
							className='form-control'
							id='urlInput'
							type='url' 
							placeholder='Enter URL (incl. http)'
							value={this.props.URLvalue}
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

export default MainForm;