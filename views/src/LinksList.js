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
				<ul>
				{
					this.props.list.map((val, index) => {
					return (
						<li key={ index } id={ val._id }>
							<button onClick={this.props.removeLink.bind(this, index, val._id)}>x</button>
							<span>{this.formatDate(new Date(val.date))}</span>
							<a href={val.url}>{val.title}</a>
						</li>
					)
				})}
				</ul>
			</div>
		);
	}
}

export default LinksList;