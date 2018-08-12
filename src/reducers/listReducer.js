
const initialState = {
	visibleList: [],
	page: 1,
	maxPages: 1,
	count: 1,
	commonTags: []
};

const listReducer = (state = initialState, payload) => {
	switch (payload.type) {
		case 'UPDATE_LIST':
			if (payload.list) {
				return {
					...state,
					visibleList: payload.list.sort((a, b) => (new Date(b.date) - new Date(a.date))), // sort by date
					maxPages: Math.ceil(payload.count / state.userSettings.linksPerPage),
					count: payload.count
				};
			} else {
				return state;
			}
		case 'NEXT_PAGE':
			return { ...state, page: state.page + 1 }
		case 'PREVIOUS_PAGE':
			return { ...state, page: state.page - 1 }
		case 'RESET_PAGE':
			return { ...state, page: 1 }
		case 'RESET_LIST':
			return { ...state, page: 1, visibleList: [] }
		case 'ADD_LINK':
			return { ...state, visibleList: [payload.newLink, ...state.visibleList] };
		case 'UPDATE_LINK':
			return { ...state, visibleList: [payload.newLink, ...state.visibleList.slice(1)] };
		case 'REMOVE_LINK':
			let newList1 = state.visibleList.filter(item => {
				return item.linkId !== payload.id;
			});
			return { ...state, visibleList: newList1 };
		case 'UPDATE_TAGS':
			return { ...state, comfmonTags: payload.tags };
		case 'ADD_TAG':
			let newList2 = [];
			state.visibleList.forEach(item => {
				if (item.linkId === payload.linkId) {
					// filter to avoid having 2 identical tags
					let newTags = item.tags ?
						item.tags.filter(tagItem => {
							return tagItem.name !== payload.tagName || tagItem.color !== payload.tagColor;
						})
						: [];
					newTags.push({ "name": payload.tagName, "color": payload.tagColor });
					newList2.push({ ...item, tags: newTags });
				} else {
					newList2.push(item);
				}
			});
			return { ...state, visibleList: newList2 };
		case 'REMOVE_TAG':
			let newList3 = [];
			state.visibleList.forEach(item2 => {
				if (item2.linkId === payload.linkId) {
					let newTags2 = item2.tags ?
						item2.tags.filter(tagItem2 => {
							return tagItem2.name !== payload.tagName || tagItem2.color !== payload.tagColor;
						})
						: [];
					newList3.push({ ...item2, tags: newTags2 });
				} else {
					newList3.push(item2);
				}
			});
			return { ...state, visibleList: newList3 };
		default: return state;
	}
};

export default listReducer;