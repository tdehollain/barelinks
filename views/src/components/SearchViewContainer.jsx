import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import { Route } from 'react-router-dom';
import TagsViewForm from './TagsViewForm';
import SearchViewListContainer from './SearchViewListContainer';

class SearchViewContainer extends Component {
	constructor() {
		super();
		
		this.state = {
			enteredValue: ''
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		// reset active page to 1
		store.dispatch({
			"type": 'RESET_PAGE',
		});
	}
	
	handleChange(e) {
		// update search string
		this.setState({ "enteredValue": e.target.value });
		this.props.history.push('/search/' + e.target.value);
	}

	render() {

		return (
			<div className='SearchViewContainer container'>
				<TagsViewForm
					handleChange={this.handleChange}
					enteredValue={this.state.enteredValue}
					placeholder={'Search...'}
				/>
				<Route path='/search/:searchTerm/' component={SearchViewListContainer} />
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		list: store.listState,
		userSettings: store.userState.userSettings
	}
}

export default connect(mapStateToProps)(SearchViewContainer);