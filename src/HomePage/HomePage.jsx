import React from 'react';
import { connect } from 'react-redux';
import HomeFormContainer from './HomeForm/HomeFormContainer';
import List from './List/List';
import AddTagModalContainer from '../AddTagModal/AddTagModalContainer';
import listActions from './List/listActions';
import { useAuth0 } from '../Auth/react-auth0-spa';

const HomePage = props => {
  const { getTokenSilently } = useAuth0();
  // When mounting: load the list of links and the list of tags
  React.useEffect(() => {
    // props.resetList(); // if we want the list to be back to page 1 if user goes to different route and back
    let params = {
      linksPerPage: props.linksPerPage,
      page: props.page
    };
    const loadLinks = async () => {
      const token = await getTokenSilently();
      props.loadList(props.username, token, 'homepage', params);
      props.loadCommonTags(props.username, token);
    };
    loadLinks();
  }, []);

  const handleNextPage = async () => {
    if (props.page < props.maxPages) {
      let params = {
        linksPerPage: props.linksPerPage,
        page: props.page + 1
      };
      const token = await getTokenSilently();
      props.loadList(props.username, token, 'homepage', params);
      props.nextPage();
    }
  };

  const handlePreviousPage = async () => {
    if (props.page > 1) {
      let params = {
        linksPerPage: props.linksPerPage,
        page: props.page - 1
      };
      const token = await getTokenSilently();
      props.loadList(props.username, token, 'homepage', params);
      props.previousPage();
    }
  };

  return (
    <div className="HomePage container mt-5">
      <HomeFormContainer username={props.username} />
      <List
        username={props.username}
        list={props.list}
        maxTags={props.maxTags}
        currentPage={props.page}
        maxPages={props.maxPages}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        loading={props.loading}
      />
      <AddTagModalContainer username={props.username} commonTags={props.commonTags} />
      {process.env.REACT_APP_STAGE !== 'production' && <footer>Barelinks - stage: {process.env.REACT_APP_STAGE}</footer>}
    </div>
  );
};

const mapStateToProps = store => {
  return {
    maxTags: store.userReducer.settings.maxTags,
    linksPerPage: store.userReducer.settings.linksPerPage,
    list: store.listReducer.visibleList,
    page: store.listReducer.page,
    loading: store.listReducer.loading,
    maxPages: store.listReducer.maxPages,
    commonTags: store.listReducer.commonTags
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetList: () => dispatch(listActions.resetList()),
    loadList: (username, token, type, params) => dispatch(listActions.loadList(username, token, type, params)),
    nextPage: () => dispatch(listActions.nextPage()),
    previousPage: () => dispatch(listActions.previousPage()),
    loadCommonTags: (username, token) => dispatch(listActions.loadCommonTags(username, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
