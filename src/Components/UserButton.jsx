import React from 'react';
import { useAuth0 } from '../Auth/react-auth0-spa';

const UserButton = props => {
  const { loginWithRedirect, isAuthenticated, loading, logout } = useAuth0();
  return (
    <div>
      {isAuthenticated ? (
        <button className="btn btn-outline-secondary mr-3" onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
      ) : isAuthenticated === undefined || loading ? (
        <button disabled className="btn btn-outline-secondary mr-3 waiting">
          Loading...
        </button>
      ) : (
        <button className="btn btn-outline-secondary mr-3" onClick={() => loginWithRedirect()}>
          Log in
        </button>
      )}
    </div>
  );
};

export default UserButton;
