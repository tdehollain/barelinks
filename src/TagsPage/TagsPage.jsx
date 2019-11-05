import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import TagsFormContainer from './TagsForm/TagsFormContainer';
import TagsViewContainer from './TagsView/TagsViewContainer';
import AddTagModalContainer from '../AddTagModal/AddTagModalContainer';
import listActions from '../HomePage/List/listActions';
import { useAuth0 } from '../Auth/react-auth0-spa';

const TagsPage = props => {
  const { getTokenSilently } = useAuth0();

  // When mounting: load list of tags
  React.useEffect(() => {
    const loadTags = async () => {
      const token = await getTokenSilently();
      props.loadCommonTags(props.username, token);
    };
    loadTags();
  }, []);

  return (
    <div className="TagsPage container mt-5">
      <TagsFormContainer />
      <Route path="/tags/:tagName/:tagColor" render={routeProps => <TagsViewContainer {...routeProps} username={props.username} />} />
      <AddTagModalContainer username={props.username} commonTags={props.commonTags} />
    </div>
  );
};

const mapStateToProps = store => {
  return {
    commonTags: store.listReducer.commonTags
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadCommonTags: (username, token) => dispatch(listActions.loadCommonTags(username, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagsPage);
