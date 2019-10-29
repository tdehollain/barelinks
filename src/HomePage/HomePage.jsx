import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeFormContainer from './HomeForm/HomeFormContainer';
import List from './List/List';
import AddTagModalContainer from '../AddTagModal/AddTagModalContainer';
import listActions from './List/listActions';

class HomePage extends Component {
  constructor() {
    super();

    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePreviousPage = this.handlePreviousPage.bind(this);
  }

  componentDidMount() {
    // this.props.resetList(); // if we want the list to be back to page 1 if user goes to different route and back
    let params = {
      linksPerPage: this.props.linksPerPage,
      page: this.props.page
    };
    this.props.loadList(this.props.username, 'homepage', params);

    this.props.loadCommonTags(this.props.username);
  }

  handleNextPage() {
    if (this.props.page < this.props.maxPages) {
      let params = {
        linksPerPage: this.props.linksPerPage,
        page: this.props.page + 1
      };
      this.props.loadList(this.props.username, 'homepage', params);
      this.props.nextPage();
    }
  }

  handlePreviousPage() {
    if (this.props.page > 1) {
      let params = {
        linksPerPage: this.props.linksPerPage,
        page: this.props.page - 1
      };
      this.props.loadList(this.props.username, 'homepage', params);
      this.props.previousPage();
    }
  }

  render() {
    return (
      <div className="HomePage container mt-5">
        <HomeFormContainer />
        <List
          list={this.props.list}
          maxTags={this.props.maxTags}
          currentPage={this.props.page}
          maxPages={this.props.maxPages}
          handleNextPage={this.handleNextPage}
          handlePreviousPage={this.handlePreviousPage}
          loading={this.props.loading}
        />
        <AddTagModalContainer commonTags={this.props.commonTags} />
        <footer>Barelinks - stage: {process.env.REACT_APP_STAGE}</footer>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    username: store.userReducer.username,
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
    loadList: (username, type, params) => dispatch(listActions.loadList(username, type, params)),
    nextPage: () => dispatch(listActions.nextPage()),
    previousPage: () => dispatch(listActions.previousPage()),
    loadCommonTags: username => dispatch(listActions.loadCommonTags(username))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
