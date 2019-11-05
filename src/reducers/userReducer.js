const initialState = {
  settings: {
    maxTags: 3,
    linksPerPage: 50,
    maxTagsToShow: 200,
    maxTagsToShowInModal: 15
  },
  tagColors: ['#B0BEC5', '#BCAAA4', '#FFCC80', '#FFF59D', '#C5E1A5', '#80CBC4', '#81D4FA', '#9FA8DA', '#CE93D8', '#EF9A9A']
};

const userReducer = (state = initialState, payload) => {
  switch (payload.type) {
    default:
      return state;
  }
};

export default userReducer;
