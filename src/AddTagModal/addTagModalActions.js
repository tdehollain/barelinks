import addTagModalActionTypes from './addTagModalActionTypes';
import API from '../helpers/API';

const showAddTagModal = (linkKey, linkId) => {
	return {
		type: addTagModalActionTypes.SHOW_MODAL,
		linkKey,
		linkId
	}
}

const loadCommonTags = (username) => {
	return async (dispatch) => {
		let tags = username ? await API.getTags(username) : []; // !username if user not authenticated
		dispatch({
			type: addTagModalActionTypes.UPDATE_TAGS,
			tags
		});
	}
}

export default {
	showAddTagModal,
	loadCommonTags
}