import React from 'react';
import { connect } from 'react-redux';
import List from '../../HomePage/List/List';
import listActions from '../../HomePage/List/listActions';
import CommonTag from '../../AddTagModal/CommonTag/CommonTag';
import { useAuth0 } from '../../Auth/react-auth0-spa';

const TagsViewContainer = props => {
  const { getTokenSilently } = useAuth0();

  // When username is available: load list of links
  React.useEffect(() => {
    props.resetList(); // if we want the list to be back to page 1 if user goes to different route and back
    let params = {
      linksPerPage: props.linksPerPage,
      page: props.page,
      tagName: decodeURIComponent(props.match.params.tagName),
      tagColor: props.match.params.tagColor
    };
    const load = async () => {
      const token = await getTokenSilently();
      props.loadList(props.username, token, 'tagspage', params);
    };
    load();
  }, [props.username]);

  // When page or tag changes: load list
  React.useEffect(() => {
    let params = {
      linksPerPage: props.linksPerPage,
      page: props.page,
      tagName: decodeURIComponent(props.match.params.tagName),
      tagColor: props.match.params.tagColor
    };
    const load = async () => {
      const token = await getTokenSilently();
      props.loadList(props.username, token, 'tagspage', params);
    };
    load();
  }, [props.page, props.match.params.tagName]);

  const handleNextPage = async () => {
    if (props.page < props.maxPages) {
      let params = {
        linksPerPage: props.linksPerPage,
        page: props.page + 1,
        tagName: decodeURIComponent(props.match.params.tagName),
        tagColor: props.match.params.tagColor
      };
      const token = await getTokenSilently();
      props.loadList(props.username, token, 'tagspage', params);
      props.nextPage();
    }
  };

  const handlePreviousPage = async () => {
    if (props.page > 1) {
      let params = {
        linksPerPage: props.linksPerPage,
        page: props.page - 1,
        tagName: decodeURIComponent(props.match.params.tagName),
        tagColor: props.match.params.tagColor
      };
      const token = await getTokenSilently();
      props.loadList(props.username, token, 'tagspage', params);
      props.previousPage();
    }
  };

  return (
    <div>
      <div className="mb-3">
        <span style={{ borderBottom: '1px solid black', paddingBottom: '2px' }}>Showing results for tag</span>{' '}
        <CommonTag
          key={1}
          name={decodeURIComponent(props.match.params.tagName)}
          color={'#' + props.match.params.tagColor}
          tagClick={() => {}}
        />
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
)(TagsViewContainer);
