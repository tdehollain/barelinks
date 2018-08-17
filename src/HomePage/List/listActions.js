import listActionTypes from './listActionTypes';
import API from '../../helpers/API';

const resetList = () => {
	return {
		type: listActionTypes.RESET_LIST
	}
}

const loadList = (username, type, params) => {
	return async (dispatch) => {
		dispatch(loadingList());
		let list = await API.getLinks(username, type, params);
		dispatch({
			type: listActionTypes.UPDATE_LIST,
			list: list.list,
			count: list.totalCount,
			linksPerPage: params.linksPerPage
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

const loadCommonTags = (username) => {
	return async (dispatch) => {
		let tags = username ? await API.getTags(username) : []; // !username if user not authenticated
		dispatch({
			type: listActionTypes.UPDATE_TAGS,
			tags
		});
	}
}

export default {
	resetList,
	loadList,
	nextPage,
	previousPage,
	loadCommonTags
}