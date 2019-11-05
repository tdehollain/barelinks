import React from 'react';
import { connect } from 'react-redux';
import { useAuth0 } from '../../Auth/react-auth0-spa';
import HomeForm from './HomeForm';
import { homeFormActions } from './homeFormActions';
import { URLisValid } from '../../utils/util';

const HomeFormContainer = ({ username, addLink }) => {
  const [enteredURL, setEnteredURL] = React.useState('');
  const { getTokenSilently } = useAuth0();

  const handleChange = e => {
    setEnteredURL(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (URLisValid(enteredURL)) {
      const token = await getTokenSilently();
      await addLink(username, token, enteredURL);
      setEnteredURL('');
    }
  };

  return <HomeForm handleChange={handleChange} enteredURL={enteredURL} handleSubmit={handleSubmit} />;
};

const mapDispatchToProps = dispatch => {
  return {
    addLink: (username, token, url) => dispatch(homeFormActions.addLink(username, token, url))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(HomeFormContainer);
