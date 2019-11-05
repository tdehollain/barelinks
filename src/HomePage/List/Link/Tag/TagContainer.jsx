import React from 'react';
import { connect } from 'react-redux';
import Tag from './Tag';
import tagActions from './tagActions';
import { useAuth0 } from '../../../../Auth/react-auth0-spa';
// import PropTypes from 'prop-types';

const TagContainer = props => {
  const { getTokenSilently } = useAuth0();

  const removeTag = async () => {
    const token = await getTokenSilently();
    let tagDetails = {
      linkId: props.linkId,
      tagName: props.name,
      tagColor: props.color
    };
    props.removeTag(props.username, token, tagDetails);
  };

  return <Tag name={props.name} color={props.color} removeTag={removeTag} showDeleteButton={props.showDeleteButton} />;
};

// TagContainer.propTypes = {
// 	linkId: PropTypes.string.isRequired,
// 	name: PropTypes.string.isRequired,
// 	color: PropTypes.string.isRequired
// }

const mapDispatchToProps = dispatch => {
  return {
    removeTag: (username, token, tagDetails) => dispatch(tagActions.removeTag(username, token, tagDetails))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(TagContainer);
