import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../../HomePage/List/List';
import listActions from '../../HomePage/List/listActions';
import CommonTag from '../../AddTagModal/CommonTag/CommonTag';

class TagsViewContainer extends Component {
  constructor() {
    super();

    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePreviousPage = this.handlePreviousPage.bind(this);
  }

  componentDidMount() {
    this.props.resetList(); // if we want the list to be back to page 1 if user goes to different route and back
    let params = {
      linksPerPage: this.props.linksPerPage,
      page: this.props.page,
      tagName: decodeURIComponent(this.props.match.params.tagName),
      tagColor: this.props.match.params.tagColor
    };
    this.props.loadList(this.props.username, 'tagspage', params);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.page !== this.props.page ||
      decodeURIComponent(prevProps.match.params.tagName) !== decodeURIComponent(this.props.match.params.tagName)
    ) {
      let params = {
        linksPerPage: this.props.linksPerPage,
        page: this.props.page,
        tagName: decodeURIComponent(this.props.match.params.tagName),
        tagColor: this.props.match.params.tagColor
      };
      this.props.loadList(this.props.username, 'tagspage', params);
    }
  }

  // componentWillReceiveProps(nextProps) {
  // 	// console.log('componentWillReceiveProps');
  // 	if (nextProps.page !== this.props.page || decodeURIComponent(nextProps.match.params.tagName) !== decodeURIComponent(this.props.match.params.tagName)) {
  // 		let params = {
  // 			linksPerPage: nextProps.linksPerPage,
  // 			page: nextProps.page,
  // 			tagName: decodeURIComponent(nextProps.match.params.tagName),
  // 			tagColor: nextProps.match.params.tagColor
  // 		}
  // 		this.props.loadList(nextProps.username, 'tagspage', params);
  // 	}
  // }

  handleNextPage() {
    if (this.props.page < this.props.maxPages) {
      let params = {
        linksPerPage: this.props.linksPerPage,
        page: this.props.page + 1,
        tagName: decodeURIComponent(this.props.match.params.tagName),
        tagColor: this.props.match.params.tagColor
      };
      this.props.loadList(this.props.username, 'tagspage', params);
      this.props.nextPage();
    }
  }

  handlePreviousPage() {
    if (this.props.page > 1) {
      let params = {
        linksPerPage: this.props.linksPerPage,
        page: this.props.page - 1,
        tagName: decodeURIComponent(this.props.match.params.tagName),
        tagColor: this.props.match.params.tagColor
      };
      this.props.loadList(this.props.username, 'tagspage', params);
      this.props.previousPage();
    }
  }

  render() {
    return (
      <div>
        <div className="mb-3">
          <span>
            <u>Showing results for tag</u>{' '}
          </span>
          <CommonTag
            key={1}
            name={decodeURIComponent(this.props.match.params.tagName)}
            color={'#' + this.props.match.params.tagColor}
            tagClick={() => {}}
          />
        </div>
        <List
          list={this.props.list}
          maxTags={this.props.maxTags}
          currentPage={this.props.page}
          maxPages={this.props.maxPages}
          handleNextPage={this.handleNextPage}
          handlePreviousPage={this.handlePreviousPage}
          loading={this.props.loading}
        />
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
)(TagsViewContainer);
