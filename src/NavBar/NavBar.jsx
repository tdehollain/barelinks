import React, { Component } from 'react';
import UserButton from '../Components/UserButton';
import { Link } from 'react-router-dom';

class NavBar extends Component {
  render() {
    return (
      <nav className="NavBar navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand ml-3" to="/">
          BareLinks
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto ml-3">
            <li className="nav-item">
              <Link className="nav-link" to="/tags">
                Tags
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">
                Search
              </Link>
            </li>
          </ul>
        </div>
        <UserButton />
      </nav>
    );
  }
}

export default NavBar;
