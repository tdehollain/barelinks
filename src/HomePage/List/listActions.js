import listActionTypes from './listActionTypes';
import API from '../../helpers/API';

const resetList = () => {
	return {
		type: listActionTypes.RESET_LIST
	}
}

const loadList = (username, linksPerPage, page) => {
	return async (dispatch) => {
		dispatch(loadingList());
		let list = await API.getLinks(username, linksPerPage, page);
		dispatch({
			type: listActionTypes.UPDATE_LIST,
			list: list.list,
			count: list.totalCount,
			linksPerPage
		})
	}
}

const loadingList = () => {
	return {
		type: listActionTypes.LOADING_LIST
	}
}

const nextPage = () => {
	return {
		type: listActionTypes.LOAD_NEXT_PAGE
	}
}

const previousPage = () => {
	return {
		type: listActionTypes.LOAD_PREVIOUS_PAGE
	}
}

export default {
	resetList,
	loadList,
	nextPage,
	previousPage
}