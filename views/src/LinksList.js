import React, { Component } from 'react';
import LinkTags from './LinkTags';

class LinksList extends Component {

	formatDate(date, showYear) {
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let day = date.getDate();
		let dayStr = day < 10 ? '0' + day : day;
		let month = date.getMonth();
		let monthStr = monthNames[month];
		let year = date.getFullYear();
		return showYear ? dayStr + ' ' + monthStr + ' ' + year : dayStr + ' ' + monthStr;
	}

	showYear(date) {
		// Shows the year if it is the current on
		// Question: show year always in search and tags views?
		let currentDate = new Date();
		return currentDate.getFullYear() !== date.getFullYear();
	}

	render() {
		return (
			<div className='LinksList'>
				<ul className='pl-1'>
				{
					this.props.list.map((elem, index) => {
					return (
						<li key={ index } id={ elem._id }>
							<button
								type='button'
								className='delBtn btn btn-danger'
								onClick={this.props.removeLink.bind(this, index, elem._id)}>
									&times;
							</button>
							<span className="small font-italic mx-1 mt-0">{this.formatDate(new Date(elem.date), this.showYear(new Date(elem.date)))}</span>
							<a 
								className='link' 
								id={'link_' + index}
								href={elem.url}>{elem.title.trim()}
							</a>
							<LinkTags 
								linkKey={index}
								linkId={elem._id}
								showAddTagModal={this.props.showAddTagModal}
								removeTag={this.props.removeTag}
								tags={elem.tags}
							/>
						</li>
					)
				})}
				</ul>
			</div>
		);
	}
}

export default LinksList;