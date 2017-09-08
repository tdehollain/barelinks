import React, { Component } from 'react';

class AddTagButton extends Component {
	render() {
		return (

			<div className='d-inline'>
				<button
					type='button'
					className='btn btn-outline-success tag addTagButton'
					data-toggle="modal"
					data-target="#addTagModal"
					onClick={this.props.showAddTagModal.bind(this, this.props.linkKey, this.props.linkId)}
				>
				+
				</button>
			</div>
		)
	}
}

export default AddTagButton;