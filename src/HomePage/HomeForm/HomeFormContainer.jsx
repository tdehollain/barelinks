import React from 'react';
import { connect } from 'react-redux';
import HomeForm from './HomeForm';
import { homeFormActions } from './homeFormActions';
import { URLisValid } from '../../utils/util';

const HomeFormContainer = ({ username, addLink }) => {
  const [enteredURL, setEnteredURL] = React.useState('');

  const handleChange = e => {
    setEnteredURL(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (URLisValid(enteredURL)) {
      await addLink(username, enteredURL);
      setEnteredURL('');
    }
  };

  return <HomeForm handleChange={handleChange} enteredURL={enteredURL} handleSubmit={handleSubmit} />;
};

const mapStateToProps = store => {
  return {
    username: store.userReducer.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addLink: (username, url) => dispatch(homeFormActions.addLink(username, url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeFormContainer);
