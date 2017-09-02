import React, { Component } from 'react';
import $ from 'jquery';

class AddTagModal extends Component {

	constructor() {
		super();
		
		this.state = {
			"tagName": ""
		};

		this.handleTagChange = this.handleTagChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
	}

	handleTagChange(e) {
		this.setState({
			"tagName": e.target.value
		});
	}

	handleKeyPress(e) {
		if(e.charCode===13) $('#addTagSubmitButton').click();
	}

	handleSubmitClick() {
		this.props.addTag(this.state.tagName);
		this.setState({
			"tagName": ""
		});
	}

	componentDidMount() {
		$('#addTagModal').on('shown.bs.modal', () => {
			alert();
			$('#addTagInput').focus();
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
								value={this.state.tagName}
								onChange={this.handleTagChange}
								onKeyPress={this.handleKeyPress}
							/>
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