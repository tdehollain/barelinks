import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonTag from './CommonTag';
import ColorButtons from './ColorButtons';
import $ from 'jquery';

class AddTagModal extends Component {

	constructor() {
		super();

		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleKeyPress(e) {
		let key = 'which' in e ? e.which : e.keyCode;
		if(key===13) $('#addTagSubmitButton').click();
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
						<div className='container'>
							<input
								type='text'
								id='addTagInput'
								className='form-control mt-3'
								placeholder='Search existing tags, or enter new tag name'
								autoFocus
								value={this.props.enteredTagName}
								onChange={this.props.changeEnteredTagName}
								onKeyPress={this.handleKeyPress}
							/>
						</div>
						<div className="modal-body mt-2 pt-1 pb-0">
							{this.props.commonTags.map((tag, index) => {
								return (
									<CommonTag 
										key={index} 
										name={tag.name} 
										color={tag.color} 
										tagClick={this.props.tagClick} 
									/>
								)
							})}
						</div>
						<div>
							<p className='newTagColorText'>New tag color:</p>
						</div>
						<ColorButtons
							tagColors={this.props.tagColors}
							activeColor={this.props.activeColor}
							selectTagColor={this.props.selectTagColor}
							handleKeyPress={this.handleKeyPress}
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
								onClick={this.props.addTag}
							>
								Create new tag
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

AddTagModal.propTypes = {
	tagClick: PropTypes.func.isRequired,
	commonTags: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		color: PropTypes.string.isRequired
	})),
	enteredTagName: PropTypes.string.isRequired,
	changeEnteredTagName: PropTypes.func.isRequired,
	tagColors: PropTypes.arrayOf(PropTypes.string).isRequired,
	activeColor: PropTypes.number.isRequired,
	selectTagColor: PropTypes.func.isRequired,
	addTag: PropTypes.func.isRequired
}

export default AddTagModal;

