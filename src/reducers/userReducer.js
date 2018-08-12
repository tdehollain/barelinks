import loginActionTypes from '../Auth/Login/loginActionTypes';

let isAuthenticated = localStorage.getItem('user') ? true : false;
let username = isAuthenticated ? JSON.parse(localStorage.getItem('user')).username : '';

const initialState = {
	isAuthenticated,
	username,
	userSettings: {
		maxTags: 3,
		linksPerPage: 50,
		maxTagsToShow: 200,
		maxTagsToShowInModal: 15
	},
	tagColors: ['#B0BEC5', '#BCAAA4', '#FFCC80', '#FFF59D', '#C5E1A5', '#80CBC4', '#81D4FA', '#9FA8DA', '#CE93D8', '#EF9A9A']
};

const userReducer = (state = initialState, payload) => {
	switch (payload.type) {
		case loginActionTypes.LOGIN_SUCCESS:
			return { ...state, isAuthenticated: true, username: payload.username };
		case loginActionTypes.LOGIN_FAILURE_NOT_CONFIRMED:
			return { ...state, isAuthenticated: false };
		case loginActionTypes.LOGIN_FAILURE_PASSWORD:
			return { ...state, isAuthenticated: false };
		case loginActionTypes.LOGIN_FAILURE:
			return { ...state, isAuthenticated: false };
		case loginActionTypes.LOGOUT:
			return { ...state, username: '', isAuthenticated: false };
		default: return state;
	}
};

export default userReducer;