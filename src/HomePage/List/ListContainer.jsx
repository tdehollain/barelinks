import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import List from './List';

const ListContainer = props => {
  return (
    <List
      username={props.username}
      list={props.list}
      maxTags={props.maxTags}
      currentPage={props.page}
      maxPages={props.maxPages}
      handleNextPage={props.handleNextPage}
      handlePreviousPage={props.handlePreviousPage}
      loading={props.loading}
    />
  );
};

const mapStateToProps = store => {
  return {
    loading: store.listReducer.loading,
    page: store.listReducer.page,
    linksPerPage: store.userReducer.settings.linksPerPage,
    maxTags: store.userReducer.settings.maxTags
  };
};

export default withRouter(connect(mapStateToProps)(ListContainer));
