import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Movies from "./components/movies";
import NotFound from "./components/notFound";
import Recommend from "./components/recommend";
import NavBar from "./components/navbar";
import MovieForm from "./components/movieForm";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Logout from "./components/logout";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <NavBar user={user} />
        <ToastContainer />
        <main className="container">
          <Switch>
            <Route
              path="/register"
              component={RegisterForm}
            />
            <Route
              path="/login"
              component={LoginForm}
            />
            <Route
              path="/logout"
              component={Logout}
            />
            <ProtectedRoute
              path="/movies/:id"
              component={MovieForm}
            />
            <Route
              path="/movies"
              render={(props) => (
                <Movies
                  {...props}
                  user={this.state.user}
                />
              )}
            />
            <Route
              path="/recommend"
              component={Recommend}
            />
            <Route
              path="/not-found"
              component={NotFound}
            />
            <Redirect
              from="/"
              exact
              to="movies"
            />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
