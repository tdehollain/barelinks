import React from 'react';
import { connect } from 'react-redux';
import TagsForm from './TagsForm';
import TagsFormTags from './TagsFormTags';
import history from '../../helpers/history/history';

const TagsFormContainer = props => {
  const [enteredValue, setEnteredValue] = React.useState('');
  const [tags, setTags] = React.useState([]);

  // When list of common tags is loaded: set the tags to the list of common tags
  React.useEffect(() => {
    setTags(props.list.commonTags);
  }, [props.list.commonTags]);

  const handleChange = e => {
    // update search string
    setEnteredValue(e.target.value);

    // update list of displayed tags
    let newTags = props.list.commonTags.filter(tag => {
      return tag.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
    });
    setTags(newTags);
  };

  const handleTagClick = (name, color) => {
    history.push('/tags/' + name + '/' + color.slice(-6));
  };

  return (
    <div className="TagsFormContainer container mb-5">
      <TagsForm handleChange={handleChange} enteredValue={enteredValue} placeholder={'Enter a tag name'} />
      <TagsFormTags tags={tags} tagClick={handleTagClick} />
    </div>
  );
};

const mapStateToProps = store => {
  return {
    list: store.listReducer,
    userSettings: store.userReducer.settings
  };
};

export default connect(mapStateToProps)(TagsFormContainer);
