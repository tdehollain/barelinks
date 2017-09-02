import React, { Component } from 'react';
import GoTag from 'react-icons/lib/go/tag';
import GoTrashcan from 'react-icons/lib/go/trashcan';
import $ from 'jquery';

class LinkTabs extends Component {

	addTagHovers() {
		$('.tagIcon svg').hover(function() {
			$(this).parent().parent().addClass('edit');
		}, function(){
			$(this).parent().parent().removeClass('edit');
		});

		$('.trashcanIcon svg').hover(function() {
			$(this).parent().parent().addClass('delete');
		}, function(){
			$(this).parent().parent().removeClass('delete');
		});
	}

	componentDidUpdate() {
	// 	$('li').hover(function() {
	// 			$(this).find('.tags').removeClass('hidden');
	// 		}, function(){
	// 			$(this).find('.tags').addClass('hidden');
	// 		});
		this.addTagHovers();
	}

	componentDidMount() {
		this.addTagHovers();
	}

	render() {
	
		let tabsCount = this.props.tags ? this.props.tags.length : 0;

		let addTagButton = null;
		if(tabsCount < 3) {
			addTagButton = 
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
		}

		let tagsSpan = null;
		if(tabsCount > 0) {
			tagsSpan = this.props.tags.map((tag, index) => {
				return (
					<span 
						key={index}
						id={'tag' + index}
						className='tag small'
					>
						<span className='tagIcon'>
							<GoTag />
						</span>
						<a href={'/tag/' + tag.name}>
							{tag.name}
						</a>
						<span className='trashcanIcon' onClick={this.props.removeTag.bind(this, this.props.linkKey, index, tag.name)}>
							<GoTrashcan />
						</span>
					</span>
				)
			});
		}

		return (
			<span className={'tags'}>
				{tagsSpan}
				{addTagButton}
			</span>
		);
	}
}

export default LinkTabs;