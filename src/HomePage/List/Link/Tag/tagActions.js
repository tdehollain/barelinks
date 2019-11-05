import tagActionTypes from './tagActionTypes';
import API from '../../../../helpers/API';

const removeTag = (username, token, tagDetails) => {
  return async dispatch => {
    dispatch({
      type: tagActionTypes.REMOVE_TAG,
      ...tagDetails
    });
    await API.addRemoveTag(username, token, tagDetails, 'removeTag');
  };
};

const addTag = (username, token, tagDetails) => {
  return async dispatch => {
    dispatch({
      type: tagActionTypes.ADD_TAG,
      ...tagDetails
    });
    await API.addRemoveTag(username, token, tagDetails, 'addTag');
  };
};

export default {
  removeTag,
  addTag
};
