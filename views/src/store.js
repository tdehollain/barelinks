import { createStore, combineReducers } from 'redux';
// import { immutableDelete } from './helpers/Utils';

/*===================
===     User     ====
===================*/

const initialUserState = {
	userSettings: {
		maxTags: 3,
		linksPerPage: 50
	},
	commonTags: [{name: 'test 1', color: 'B0BEC5'}, {name: 'test 2', color: 'BCAAA4'}, {name: 'test 3', color: '80CBC4'}, {name: 'test 4', color: 'CE93D8'}, {name: 'test 5', color: 'EF9A9A'}],
	tagColors: ['B0BEC5','BCAAA4','FFCC80','FFF59D','C5E1A5','80CBC4','81D4FA','9FA8DA','CE93D8','EF9A9A']
};

const userReducer = (state=initialUserState, action) => {
	switch(action.type) {
		case 'CHANGE_USERNAME':
			return {...state, username: action.username };
		default: return state;
	}
};


/*===================
===     List     ====
===================*/

const initialListState = { 
	visibleList: [],
	page: 1,
	maxPages: 1,
	count: 1
};

const listReducer = (state=initialListState, action) => {
	switch(action.type) {
		case 'UPDATE_LIST':
			return {...state, visibleList: action.list, maxPages: Math.ceil(action.count/initialUserState.userSettings.linksPerPage), count: action.count};
		case 'NEXT_PAGE':
			return {...state, page: state.page+1}
		case 'PREVIOUS_PAGE':
			return {...state, page: state.page-1}
		case 'ADD_LINK':
			return {...state, visibleList: [action.newLink,...state.visibleList]};
		case 'UPDATE_LINK':
			return {...state, visibleList: [action.newLink,...state.visibleList.slice(1)]};
		case 'REMOVE_LINK':
			let newList1 = state.visibleList.filter(item => {
				return item._id !== action.id;
			});
			return {...state, visibleList: newList1};
		case 'ADD_TAG':
			let newList2 = [];
			state.visibleList.forEach(item => {
				if(item._id === action.linkId) {
					// filter to avoid having 2 identical tags
					let newTags = item.tags.filter(tagItem => {
						return tagItem.name!==action.name || tagItem.color!==action.color;
					});
					newTags.push({ "name": action.name, "color": action.color });
					newList2.push({...item, tags: newTags});
				} else {
					newList2.push(item);
				}
			});
			return {...state, visibleList: newList2};
		case 'REMOVE_TAG':
			let newList3 = [];
			state.visibleList.forEach(item2 => {
				if(item2._id===action.linkId) {
					let newTags2 = item2.tags.filter(tagItem2 => {
						return tagItem2.name!==action.name || tagItem2.color!==action.color;
					});
					newList3.push({...item2, tags: newTags2});
				} else {
					newList3.push(item2);
				}
			});
			return {...state, visibleList: newList3};
		default: return state;
	}
};


/*====================
===     Modal     ====
====================*/

const initialModalState = {
	linkKey: -1,
	linkId: '',
	enteredTagName: '',
	activeColor: 0
}

const modalReducer = (state=initialModalState, action) => {
	switch(action.type) {
		case 'SHOW_MODAL':
			return {...state, linkKey: action.linkKey, linkId: action.linkId };
		default: return state;
	}
};



const reducers = combineReducers({
	userState: userReducer,
	listState: listReducer,
	modalState: modalReducer
});

export const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


