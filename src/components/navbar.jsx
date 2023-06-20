import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <Link
        className="navbar-brand"
        to="/"
      >
        CineSuggest
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse"
        id="navbarNavAltMarkup"
      >
        <div className="navbar-nav">
          <NavLink
            className="nav-item nav-link "
            aria-current="page"
            to="/movies"
          >
            Movies
          </NavLink>
          <NavLink
            className="nav-item nav-link"
            to="/recommend"
          >
            Recommend
          </NavLink>
          {!user && (
            <React.Fragment>
              <NavLink
                className="nav-item nav-link"
                to="/login"
              >
                Login
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                to="/register"
              >
                Register
              </NavLink>
            </React.Fragment>
          )}
          {user && (
            <React.Fragment>
              <NavLink
                className="nav-item nav-link"
                to="/login"
              >
                {user.name}
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                to="/logout"
              >
                Logout
              </NavLink>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
