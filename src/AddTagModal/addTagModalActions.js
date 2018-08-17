import addTagModalActionTypes from './addTagModalActionTypes';

const showAddTagModal = (linkKey, linkId) => {
	return {
		type: addTagModalActionTypes.SHOW_MODAL,
		linkKey,
		linkId
	}
}

export default {
	showAddTagModal
}