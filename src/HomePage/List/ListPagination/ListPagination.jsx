import React from 'react';

const ListPagination = (props) =>
	<div className='row align-items-center text-center justify-content-md-center my-4'>
		<button disabled={props.currentPage === 1} className='pageButton btn btn-dark' onClick={props.handlePreviousPage}>Previous</button>
		<span className='col-3'>Page {props.currentPage} of {props.maxPages}</span>
		<button disabled={props.currentPage === props.maxPages} className='pageButton btn btn-dark' onClick={props.handleNextPage}>Next</button>
	</div>

export default ListPagination;