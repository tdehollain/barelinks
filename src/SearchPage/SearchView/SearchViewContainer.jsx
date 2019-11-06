import React from 'react';
import { connect } from 'react-redux';
import List from '../../HomePage/List/List';
import listActions from '../../HomePage/List/listActions';
import { useAuth0 } from '../../Auth/react-auth0-spa';

const SearchViewContainer = props => {
  const { getTokenSilently } = useAuth0();

  // when mounting: reset the list and load the list
  React.useEffect(() => {
    props.resetList(); // if we want the list to be back to page 1 if user goes to different route and back
    updateList({ page: props.page });
  }, []);

  // when page or search term changes: update the list
  React.useEffect(() => {
    props.resetList();
    updateList({ page: props.page });
  }, [props.page, props.match.params.searchTerm]);

  const updateList = async ({ page }) => {
    let params = {
      linksPerPage: props.linksPerPage,
      page,
      searchTerm: decodeURIComponent(props.match.params.searchTerm)
    };

    const token = await getTokenSilently();
    props.loadList(props.username, token, 'searchpage', params);
  };

  const handleNextPage = () => {
    if (props.page < props.maxPages) {
      updateList({ page: props.page + 1 });
      props.nextPage();
    }
  };

  const handlePreviousPage = () => {
    if (props.page > 1) {
      updateList({ page: props.page - 1 });
      props.previousPage();
    }
  };

  return (
    <div>
      <div className="mt-3 mb-3">
        <span style={{ borderBottom: '1px solid black', paddingBottom: '2px' }}>Showing results for term</span>
        <span>: </span>
        <i>{decodeURIComponent(props.match.params.searchTerm)}</i>
      </div>
      <List
        list={props.list}
        maxTags={props.maxTags}
        currentPage={props.page}
        maxPages={props.maxPages}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        loading={props.loading}
      />
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
    loadCommonTags: username => dispatch(listActions.loadCommonTags(username))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchViewContainer);
