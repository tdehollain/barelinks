import React from 'react';
import { connect } from 'react-redux';
import Link from './Link';
import linkActions from './linkActions';
import addTagModalActions from '../../../AddTagModal/addTagModalActions';
import { useAuth0 } from '../../../Auth/react-auth0-spa';

const LinkContainer = props => {
  const { getTokenSilently } = useAuth0();

  const handleRemoveLink = async linkId => {
    const token = await getTokenSilently();
    props.removeLink(props.username, token, linkId);
  };

  const handleShowAddTagModal = (linkKey, linkId) => {
    props.showAddTagModal(linkKey, linkId);
  };

  return (
    <Link
      username={props.username}
      linkKey={props.linkKey}
      linkId={props.linkId}
      url={props.url}
      title={props.title}
      date={props.date}
      tags={props.tags}
      removeLink={handleRemoveLink}
      maxTags={props.maxTags}
      showAddTagModal={handleShowAddTagModal}
    />
  );
};

const mapDispatchToProps = dispatch => {
  return {
    removeLink: (username, token, linkId) => dispatch(linkActions.removeLink(username, token, linkId)),
    showAddTagModal: (linkKey, linkId) => dispatch(addTagModalActions.showAddTagModal(linkKey, linkId))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(LinkContainer);

// LinkContainer.propTypes = {
// 	linkKey: PropTypes.number,
// 	linkId: PropTypes.string,
// 	url: PropTypes.string,
// 	title: PropTypes.string,
// 	date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
// 	tags: PropTypes.arrayOf(PropTypes.shape({
// 		name: PropTypes.string.isRequired,
// 		color: PropTypes.string.isRequired
// 	})),
// 	maxTags: PropTypes.number.isRequired
// }
