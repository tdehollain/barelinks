import React, { Component } from 'react';
import ListPagination from './ListPagination/ListPagination';
import { css } from 'react-emotion';
import { PulseLoader } from 'react-spinners';
import LinkContainer from './Link/LinkContainer';

class List extends Component {
	render() {
		let spinnerCss = css`
			size: 10px;
			margin: 50px auto;
			`;

		return (
			<div className='LinksList'>
				{this.props.maxPages > 1 &&
					<ListPagination
						currentPage={this.props.currentPage}
						maxPages={this.props.maxPages}
						handleNextPage={this.props.handleNextPage}
						handlePreviousPage={this.props.handlePreviousPage}
					/>}
				{this.props.loading
					?
					<PulseLoader
						className={spinnerCss}
						sizeUnit={"px"}
						size={10}
						color={'#343a40'}
						loading={this.props.loading}
					/>
					:
					<ul className='pl-1'>
						{
							this.props.list.map((link, index) => {
								return (
									<LinkContainer
										key={index}
										linkKey={index}
										linkId={link.linkId}
										url={link.url}
										title={link.title}
										date={link.date}
										tags={link.tags || []}
										maxTags={this.props.maxTags}
									/>
								)
							})
						}
					</ul>}
			</div>
		)
	}
}

export default List;