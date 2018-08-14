import addTagModalActionTypes from '../AddTagModal/addTagModalActionTypes';

const initialState = {
	linkKey: -1,
	linkId: ''
}

const modalReducer = (state = initialState, payload) => {
	switch (payload.type) {
		case addTagModalActionTypes.SHOW_MODAL:
			return { ...state, linkKey: payload.linkKey, linkId: payload.linkId };
		default: return state;
	}
};

export default modalReducer;