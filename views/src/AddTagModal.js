import React, { Component } from 'react';
import { rgb2hex } from './Utils'
import $ from 'jquery';

class AddTagModal extends Component {

	constructor() {
		super();
		
		this.state = {
			"name": "",
			"color": "b0bec5"
		};

		this.handleTagChange = this.handleTagChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
	}

	handleTagChange(e) {
		this.setState({
			"name": e.target.value
		});
	}

	handleKeyPress(e) {
		if(e.charCode===13 && this.state.name) $('#addTagSubmitButton').click();
	}

	handleSubmitClick() {
		if(this.state.name) {
			// reset active color
			$('.colorItem').removeClass('active');
			$('.colorItem:first-child').addClass('active');

			this.props.addTag(this.state);
			this.setState({
				"name": "",
				"color": "b0bec5"
			});
		}
	}

	componentDidMount() {
		let that = this;
		$('#addTagModal').on('shown.bs.modal', () => {
			$('#addTagInput').focus();
		});

		$('.colorItem').click(function() {
			$('.colorItem').removeClass('active');
			$(this).addClass('active');
			that.setState({
				"color": rgb2hex($(this).css('backgroundColor')).slice(1)
			});
		});
	}

	render() {
		return(
			<div 
				className="modal fade" 
				id="addTagModal" 
				tabIndex="-1" 
				role="dialog" 
				aria-labelledby="addTagModalLabel" 
				aria-hidden="true"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="addTagModalLabel">Add tag</h5>
							<button 
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close"
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<input
								type='text'
								id='addTagInput'
								className='form-control'
								placeholder='Tag name'
								autoFocus
								value={this.state.name}
								onChange={this.handleTagChange}
								onKeyPress={this.handleKeyPress}
							/>
							<ul className="list-inline colorItems mt-4 mb-1">
								<li className="list-inline-item colorItem rounded-circle active" onKeyPress={this.handleKeyPress} style={{background: '#B0BEC5'}}></li>
								<li className="list-inline-item colorItem rounded-circle" onKeyPress={this.handleKeyPress} style={{background: '#BCAAA4'}}></li>
								<li className="list-inline-item colorItem rounded-circle" onKeyPress={this.handleKeyPress} style={{background: '#FFCC80'}}></li>
								<li className="list-inline-item colorItem rounded-circle" onKeyPress={this.handleKeyPress} style={{background: '#FFF59D'}}></li>
								<li className="list-inline-item colorItem rounded-circle" onKeyPress={this.handleKeyPress} style={{background: '#C5E1A5'}}></li>
								<li className="list-inline-item colorItem rounded-circle" onKeyPress={this.handleKeyPress} style={{background: '#80CBC4'}}></li>
								<li className="list-inline-item colorItem rounded-circle" onKeyPress={this.handleKeyPress} style={{background: '#81D4FA'}}></li>
								<li className="list-inline-item colorItem rounded-circle" onKeyPress={this.handleKeyPress} style={{background: '#9FA8DA'}}></li>
								<li className="list-inline-item colorItem rounded-circle" onKeyPress={this.handleKeyPress} style={{background: '#CE93D8'}}></li>
								<li className="list-inline-item colorItem rounded-circle" onKeyPress={this.handleKeyPress} style={{background: '#EF9A9A'}}></li>
							</ul>
						</div>
						<div className="modal-footer">
							<button 
								type="button" 
								className="btn btn-outline-secondary btn-sm" 
								data-dismiss="modal"
							>
								Cancel
							</button>
							<button
								type="button" 
								id="addTagSubmitButton"
								className="btn btn-outline-primary btn-sm" 
								data-dismiss="modal"
								onClick={this.handleSubmitClick}
							>
								Add tag
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default AddTagModal;