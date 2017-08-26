import React, { Component } from 'react';

class MainForm extends Component {

	submitLink(e) {
		alert();
		e.preventDefault();
	}

	render() {
		return (
			<div className='MainForm'>
				<form onSubmit={e => this.props.handleSubmit(e)}>
					<input 
						type='url' 
						placeholder='enter URL'
						value={this.props.URLvalue}
						onChange={this.props.handleURLchange}
					/>
					<input 
						type='submit' 
						value='Add'>
					</input>
				</form>
			</div>
		);
	}
}

export default MainForm;