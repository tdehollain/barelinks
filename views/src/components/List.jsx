import React, { Component } from 'react';
import LinkContainer from './LinkContainer';
import PropTypes from 'prop-types';

class List extends Component {

	render() {
		return (
			<div className='LinksList'>
				<div className='row align-items-center text-center justify-content-md-center my-4'>
					<button disabled={this.props.currentPage===1} className='pageButton btn btn-dark' onClick={this.props.handlePreviousPage}>Previous</button>
					<span className='col-3'>Page {this.props.currentPage} of {this.props.maxPages}</span>
					<button disabled={this.props.currentPage===this.props.maxPages} className='pageButton btn btn-dark' onClick={this.props.handleNextPage}>Next</button>
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