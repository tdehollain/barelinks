import React, { Component } from 'react';
import LinkContainer from './LinkContainer';
import PropTypes from 'prop-types';

class List extends Component {

	render() {
		return (
			<div className='LinksList'>
				<div className='row align-items-center text-center justify-content-md-center my-4'>
					<button className='col-2 btn btn-dark'>Previous</button>
					<span className='col-2'>Page 1 of 6</span>
					<button className='col-2 btn btn-dark'>Next</button>
				</div>
				<ul className='pl-1'>
					{
						this.props.list.map((link, index) => {
							return (
								<LinkContainer
									key={index}
									linkKey={index}
									linkId={link._id}
									url={link.url}
									title={link.title}
									date={link.date}
									tags={link.tags || []}
									maxTags={this.props.maxTags}
								/>
							)
						})
					}
				</ul>
			</div>
		);
	}

}

List.propTypes = {
	list: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string,
		url: PropTypes.string,
		title: PropTypes.string,
		date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
		tags: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			color: PropTypes.string.isRequired
		}))
	})).isRequired,
	maxTags: PropTypes.number.isRequired
}

export default List;