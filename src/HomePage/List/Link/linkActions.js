import linkActionTypes from './linkActionTypes';
import API from '../../../helpers/API';

const removeLink = (username, token, linkId) => {
  return async dispatch => {
    dispatch({
      type: linkActionTypes.REMOVE_LINK,
      id: linkId
    });
    await API.deleteLink(username, token, linkId);
  };
};

const showAddTagModal = (linkKey, linkId) => {
  return {
    type: linkActionTypes.SHOW_MODAL,
    linkKey,
    linkId
  };
};

export default {
  removeLink,
  showAddTagModal
};
