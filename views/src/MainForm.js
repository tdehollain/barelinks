import React, { Component } from 'react';

class MainForm extends Component {

	constructor(props) {
		super(props);

		this.focus = this.focus.bind(this);
	}

	focus() {
		this.textInput.focus();
	}

	submitLink(e) {
		alert();
		e.preventDefault();
	}

	componentDidMount() {
		this.focus();
	}

	render() {
		return (
			<div className='MainForm'>
				<form onSubmit={e => this.props.handleSubmit(e)}>
					<input 
						type='url' 
						placeholder='enter URL'
						ref={input => { this.textInput = input }}
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