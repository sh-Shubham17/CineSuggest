import React from "react";
import Form from "./common/form";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import Joi from "joi-browser";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      rating: "",
      numberOfLikes: "",
    },
    genres: [],
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    rating: Joi.number()
    .required()
    .min(0)
    .max(10)
    .label("Rating"),
    numberOfLikes: Joi.number()
      .required()
      .min(0)
      .label("Likes"),
  };

  async populateGenre() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateMovie() {
    try {
      const movieId = this.props.match.params.id;
      if (movieId === "new") return;
      const { data: movie } = await getMovie(movieId);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
      /*to avoid user to redirect to movie form page with invalid id, which will automatically redirect to not found page, so back button indirectly not works here. thus replace()*/
    }
  }

  async componentDidMount() {
    await this.populateGenre();
    await this.populateMovie();
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberOfLikes: movie.numberOfLikes,
      rating: movie.rating,
    };
  }

  doSubmit = async () => {
    const result = await saveMovie(this.state.data);
    console.log("movie result",result);
    this.props.history.push("/movies");
  };

  render() {
    return (
      <div className="text-light">
        <h1> Movie Form</h1>
        <form onSubmit={this.handleSubmit} >
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberOfLikes", "Number of Likes", "number")}
          {this.renderInput("rating", "Rating")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
