import React from 'react';
import LinkContainer from './Link/LinkContainer';

const List = (props) =>
	<div className='LinksList'>
		{props.maxPages > 1 &&
			<div className='row align-items-center text-center justify-content-md-center my-4'>
				<button disabled={props.currentPage === 1} className='pageButton btn btn-dark' onClick={props.handlePreviousPage}>Previous</button>
				<span className='col-3'>Page {props.currentPage} of {props.maxPages}</span>
				<button disabled={props.currentPage === props.maxPages} className='pageButton btn btn-dark' onClick={props.handleNextPage}>Next</button>
			</div>}
		<ul className='pl-1'>
			{
				props.list.map((link, index) => {
					return (
						<LinkContainer
							key={index}
							linkKey={index}
							linkId={link.linkId}
							url={link.url}
							title={link.title}
							date={link.date}
							tags={link.tags || []}
							maxTags={props.maxTags}
						/>
					)
				})
			}
		</ul>
	</div>


export default List;