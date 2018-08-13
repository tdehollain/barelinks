import tagActionTypes from './tagActionTypes';
import API from '../../../../helpers/API';

const removeTag = (username, tagDetails) => {
	return async (dispatch) => {
		dispatch({
			type: tagActionTypes.REMOVE_TAG,
			...tagDetails
		});
		await API.addRemoveTag(username, tagDetails, "removeTag");
	}
};

const addTag = (username, tagDetails) => {
	return async (dispatch) => {
		dispatch({
			type: tagActionTypes.ADD_TAG,
			...tagDetails
		});
		await API.addRemoveTag(username, tagDetails, "addTag");
	}
};

export default {
	removeTag,
	addTag
};