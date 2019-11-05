import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import AddTagModal from './AddTagModal';
import tagActions from '../HomePage/List/Link/Tag/tagActions';
import addTagModalActions from './addTagModalActions';
import { useAuth0 } from '../Auth/react-auth0-spa';

const AddTagModalContainer = props => {
  const { getTokenSilently } = useAuth0();

  const [currentTag, setCurrentTag] = React.useState({ name: '', colorKey: 0 });

  const handleChangeEnteredTagName = e => {
    setCurrentTag({ ...currentTag, name: e.target.value });
  };

  const handleSelectTagColor = key => {
    setCurrentTag({ ...currentTag, colorKey: key });
  };

  const handleTagClick = tag => {
    // find the color key from the color
    let colorKey = 0;
    props.tagColors.forEach((v, i) => {
      if (v === tag.color) colorKey = i;
    });

    setCurrentTag({ name: tag.name, colorKey });
    handleAddTag(tag.name, colorKey);
    document.querySelector('#addTagCancelButton').click();
  };

  const handleAddTag = async (name, colorKey) => {
    // name & color are only defined if function is called from handleTagClick (i.e. user clicks on a tag)
    if (name === undefined) name = currentTag.name;
    if (colorKey === undefined) colorKey = currentTag.colorKey;
    if (name) {
      let tagDetails = {
        linkId: props.linkId,
        tagName: name,
        tagColor: props.tagColors[colorKey]
      };
      const token = await getTokenSilently();
      props.addTag(props.username, token, tagDetails);

      setCurrentTag({ name: '', color: 0 });
    }
  };

  let commonTagsFiltered = props.commonTags.filter(tag => {
    return tag.name.toLowerCase().indexOf(currentTag.name.toLowerCase()) > -1;
  });
  let commonTagsToShow = currentTag.name
    ? commonTagsFiltered.slice(0, props.maxTagsToShowInModal)
    : props.commonTags.slice(0, props.maxTagsToShowInModal);

  return (
    <AddTagModal
      tagClick={handleTagClick}
      commonTags={commonTagsToShow}
      enteredTagName={currentTag.name}
      changeEnteredTagName={handleChangeEnteredTagName}
      tagColors={props.tagColors}
      addTag={handleAddTag}
      activeColor={currentTag.colorKey}
      selectTagColor={handleSelectTagColor}
    />
  );
};

const mapStateToProps = store => {
  return {
    maxTagsToShowInModal: store.userReducer.settings.maxTagsToShowInModal,
    tagColors: store.userReducer.tagColors,
    linkId: store.addTagModalReducer.linkId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addTag: (username, token, tagDetails) => dispatch(tagActions.addTag(username, token, tagDetails)),
    loadCommonTags: username => dispatch(addTagModalActions.loadCommonTags(username))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTagModalContainer);
