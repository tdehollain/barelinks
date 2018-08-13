import linkActionTypes from './linkActionTypes';
import API from '../../../helpers/API';

const removeLink = (username, linkId) => {
	return async (dispatch) => {
		dispatch({
			type: linkActionTypes.REMOVE_LINK,
			id: linkId
		});
		await API.deleteLink(username, linkId);
	}
}

const showAddTagModal = (linkKey, linkId) => {
	return {
		type: linkActionTypes.SHOW_MODAL,
		linkKey,
		linkId
	};
}

export default {
	removeLink,
	showAddTagModal
}