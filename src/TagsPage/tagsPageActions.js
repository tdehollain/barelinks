import tagsPageActionTypes from './tagsPageActionTypes';

const resetList = (username) => {
	return {
		type: tagsPageActionTypes
	}
}
this.API_getTags();
// reset active page to 1
store.dispatch({
	"type": 'RESET_PAGE',
});


API_getTags() {
	fetch('/api/getTags/Thib')
		.then(res => res.json())
		.then(res => {
			store.dispatch({
				"type": 'UPDATE_TAGS',
				"tags": res.tags
			});

			// start with full list of tags, limited to 'maxTagsToShow'
			this.setState({ tags: res.tags.slice(0, this.props.userSettings.maxTagsToShow) });
		});
}

export default {
	resetList
}