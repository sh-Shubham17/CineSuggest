import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviesTable";
import SearchBox from "./searchBox";
import { getMovies, deleteMovie } from "../services/movieService";
import { paginate } from "../utils/paginate";
import { getGenres } from "../services/genreService";
import _ from "lodash";
import { Link } from "react-router-dom";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
  };

  async componentDidMount() {
    //so our rest things will be loaded untill we are gettnig movies from the server
    const { data } = await getGenres(); //because getGenres is returning promise suing api call not object, thus await & async.
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  handleDelete = async (movie) => {
    //coping movies coz we are using optimistic updation approach
    const originalMovies = this.state.movies;
    const newMovies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies: newMovies });
    //console.log(newMovies);
    try {
      await deleteMovie(movie._id);
      toast.info("Movie deleted.", {
        autoClose: 2000, // Change the timer to 3000 milliseconds (3 seconds)
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.", {
          autoClose: 2000, // Change the timer to 3000 milliseconds (3 seconds)
        });
      //undoing changed coz error occured
      this.setState({ movies: originalMovies });
    }
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
    //console.log(movies);
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    // we have to set current page to 1 on selecting any other genre because it might be possible
    // we were on 2nd page before selecting thus it might not show results of 1st page and show empty
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      searchQuery,
      selectedGenre,
      sortColumn,
      movies: allMovies,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id) {
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { length: count } = this.state.movies; //refactoring and naming length to count
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state; //refactoring
    const { user } = this.props;

    if (count === 0) return <p>There are no movies in the database</p>;

    const { totalCount, data } = this.getPagedData();

    return (
      <div className="row text-light">
        <div className="col-3 ">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Movie
            </Link>
          )}
          <p>Showing {totalCount} movies in the database</p>
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          />
          <MoviesTable
            movies={data}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
