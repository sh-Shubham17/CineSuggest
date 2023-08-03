import React, { Component } from "react";
import Pagination from "./common/pagination";
import SearchBox from "./searchBox";
import { getMovies } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import SelectMovie from './selectMovie';
import { getMovieRecommendations } from "../utils/movieBasedSuggestion";
import RecommendationTable from "./recommendationTable";

class MovieBasedRecommend extends Component {
  state = {  
    movies: [],
    genres:[],
    currentPage: 1,
    pageSize: 5,
    searchQuery: "",
    selectedMovieId:"",
    enableSuggestbtn: false,
    suggestionResult:{mmakeSuggestion: false, suggestedMovies: [] },
    sortColumn : { path:"Rating", order:"asc"}
  } 
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  async componentDidMount() {
    //so our rest things will be loaded untill we are gettnig movies from the server

    const { data } = await getGenres(); //because getGenres is returning promise using api call not object, thus await & async.
    const genres = [...data];

    let { data: movies } = await getMovies();//because getMovies is returning promise using api call not object, thus await & async.
    movies = movies.map( m1 => {
      const m2 = {title: m1.title, rating: m1.rating, genre: m1.genre.name, _id: m1._id};
      return m2;
    });
    this.setState({ movies, genres });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSelect = (id) =>{
    this.setState({ enableSuggestbtn:true, selectedMovieId:id});
  }

  handleMakeSuggest = () =>{
    const { movies, genres, selectedMovieId} = this.state; //refactoring
    const allGenres = genres.map(g => g.name);
    const selectedMovie = movies.find(m => (m._id === selectedMovieId) );
    console.log(allGenres);
    console.log(selectedMovie);
    console.log(movies);
    let suggestedMovies = getMovieRecommendations(selectedMovie, movies, allGenres, 3);
    console.log("result ",suggestedMovies);
    if( suggestedMovies !== null) 
    {
      this.setState({ suggestionResult : {makedSuggestion: true, suggestedMovies}});
      console.log(this.state.suggestionResult.makedSuggestion);
    }
  }

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      searchQuery,
      movies: allMovies,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery) //implement searching 
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const movies = paginate(filtered, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() { 
    const { length: count } = this.state.movies; //refactoring and naming length to count
    const { pageSize, currentPage, searchQuery, enableSuggestbtn, selectedMovieId , suggestionResult, sortColumn} = this.state; //refactoring
    // const { user } = this.props;
    const { makedSuggestion, suggestedMovies} = suggestionResult;

    if (count === 0) return <p>There are no movies in the database</p>;

    const { totalCount, data } = this.getPagedData();
    return (
      <div className=" text-light ">
          <h4>Pick a movie to get Suggestions.</h4>
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          />
        <SelectMovie 
        data = {data}
        enableSuggestbtn={enableSuggestbtn}
        onSelectMovie = {this.handleSelect}
        selectedMovieId = {selectedMovieId}
        onMakeSuggestion = {this.handleMakeSuggest}
        />
        {/* Rendering the pagination */}
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
          currentPage={currentPage}
          />
          { makedSuggestion && <RecommendationTable movies={suggestedMovies} sortColumn={sortColumn}  onSort={this.handleSort} /> } 
    </div>
    );
  }
}
 

export default MovieBasedRecommend;
