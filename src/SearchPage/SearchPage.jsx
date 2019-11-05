import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import TagsForm from '../TagsPage/TagsForm/TagsForm';
import SearchViewContainer from './SearchView/SearchViewContainer';
import AddTagModalContainer from '../AddTagModal/AddTagModalContainer';
import listActions from '../HomePage/List/listActions';
import { useAuth0 } from '../Auth/react-auth0-spa';

const SearchPage = props => {
  const { getTokenSilently } = useAuth0();

  const [enteredValue, setEnteredValue] = React.useState('');

  // When mounting: load common tags
  React.useEffect(() => {
    const loadTags = async () => {
      const token = await getTokenSilently();
      props.loadCommonTags(props.username, token);
    };
    loadTags();
  }, []);

  const handleChange = e => {
    // update search string
    setEnteredValue(e.target.value);
    props.history.push('/search/' + encodeURIComponent(e.target.value));
  };

  return (
    <div className="SearchPage container mt-5">
      <TagsForm handleChange={handleChange} enteredValue={enteredValue} placeholder={'Search...'} />
      <Route path="/search/:searchTerm" render={routeProps => <SearchViewContainer {...routeProps} username={props.username} />} />
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
)(SearchPage);
