import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonTags from './CommonTags';
import ColorButtons from './ColorButtons'
import { rgb2hex } from '../helpers/Utils';
import $ from 'jquery';

export default class AddTagModal extends Component {

	constructor() {
		super();
		
		this.state = {
			"name": "",
			"color": "b0bec5"
		};

		this.handleTagChange = this.handleTagChange.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
	}

	handleTagChange(e) {
		this.setState({
			"name": e.target.value
		});
	}

	handleTagClick(tagDetails) {
		this.setState({
			"name": tagDetails.name,
			"color": tagDetails.color
		}, () => {
			$('#addTagSubmitButton').click();
		});
	}

	handleSubmitClick() {
		if(this.state.name) {

			this.props.addTag(this.state, this.props.linkKey);

			// reset active color
			$('.colorItem').removeClass('active');
			$('.colorItem:first-child').addClass('active');
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
								linkKey={this.props.linkKey}
								tags={this.props.commonTags}
								tagClick={this.handleTagClick}
								showTranshcan={false}
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

AddTagModal.propTypes = {
	addTag: PropTypes.func.isRequired,
	linkKey: PropTypes.number.isRequired,
	commonTags: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		color: PropTypes.string.isRequired
	})),
	tagColors: PropTypes.arrayOf(PropTypes.string).isRequired
}