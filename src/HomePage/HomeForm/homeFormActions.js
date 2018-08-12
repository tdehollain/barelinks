import homeFormActionTypes from './homeFormActionTypes';
import API from '../../helpers/API';

const addLink = (username, url) => {
	return async (dispatch) => {
		let newLink = {
			"url": url,
			"title": url,
			"date": new Date()
		}
		await dispatch(addLinkLocally(newLink));
		await dispatch(addLinkToRemote(username, url));
	}
};

const addLinkLocally = (newLink) => {
	return async (dispatch) => {
		dispatch({
			type: homeFormActionTypes.ADD_LINK,
			newLink
		});
	}
}

const addLinkToRemote = (username, url) => {
	return async (dispatch) => {
		let newLinkFromServer = await API.putLink(username, url);

		dispatch({
			type: homeFormActionTypes.UPDATE_LINK,
			newLink: newLinkFromServer.res
		});
	}
}

export const homeFormActions = {
	addLink
}