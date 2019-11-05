import React from 'react';
import NavBar from './NavBar';

const NavBarContainer = props => {
  return <NavBar isAuthenticated={props.isAuthenticated} username={props.username} />;
};

export default NavBarContainer;
