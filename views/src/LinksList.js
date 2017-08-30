import React, { Component } from 'react';

class LinksList extends Component {

	formatDate(date) {
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let day = date.getDate();
		let dayStr = day < 10 ? '0' + day : day;
		let month = date.getMonth();
		let monthStr = monthNames[month];
		let year = date.getFullYear();
		return dayStr + ' ' + monthStr + ' ' + year;
	}

	render() {
		return (
			<div className='LinksList'>
				<ul className='pl-1'>
				{
					this.props.list.map((val, index) => {
					return (
						<li key={ index } id={ val._id }>
							<button
								type='button'
								className='delBtn btn btn-danger'
								onClick={this.props.removeLink.bind(this, index, val._id)}>
									&times;
							</button>
							<span className="small font-italic mx-1 mt-0">{this.formatDate(new Date(val.date))}</span>
							<a className='p-1' href={val.url}>{val.title.trim()}</a>
						</li>
					)
				})}
				</ul>
			</div>
		);
	}
}

export default LinksList;