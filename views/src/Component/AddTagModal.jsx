import React, { Component } from 'react';
import CommonTags from './CommonTags';
import ColorButtons from './ColorButtons'
import { rgb2hex } from '../helpers/Utils';
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

	componentDidUpdate() {
		// setTimeout(() => {
			let self = this;

			$('.colorItem').click(function() {
				$('.colorItem').removeClass('active');
				$(this).addClass('active');
				self.setState({
					"color": rgb2hex($(this).css('backgroundColor')).slice(1)
				});
			});

			$('.commonTag').click(function() {
				self.setState({
					"name": $(this).find('.tagName').text(),
					"color": rgb2hex($(this).css('backgroundColor')).slice(1)
				});
				$('#addTagSubmitButton').click();
			});
		// }, 1000);
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
						<div className="modal-body pt-1">
							<CommonTags 
								context='AddTagModal'
								tags={this.props.commonTags}
							/>
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
						</div>
						<ColorButtons
							handleKeyPress={this.handleKeyPress}
							tagColors={this.props.tagColors}
						/>
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