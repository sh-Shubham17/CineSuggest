import React, { Component } from "react";
import { getMovies } from "../services/movieService";
import { getLikedMovies } from "../services/userLikedMoviesService";
import { getGenres } from "../services/genreService";
import { getMovieRecommendations } from "../utils/contentBasedSuggestion";
import RecommendationTable from "./recommendationTable";

class ContentBasedRecommend extends Component {
  state = {  
    likedMovies : [],
    allMovies : [],
    genres: [],
    suggestionResult:{mmakeSuggestion: false, suggestedMovies: [] },
    sortColumn : { path:"Rating", order:"asc"}
  } 
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  async componentDidMount() {
    //so our rest things will be loaded untill we are gettnig movies from the server

    const { data: genres } = await getGenres();
    let { data: movies } = await getMovies();//because getMovies is returning promise using api call not object, thus await & async.
    movies = movies.map( m1 => {
      const m2 = {title: m1.title, rating: m1.rating, genre: m1.genre.name, _id: m1._id};
      return m2;
    });

    const { user } = this.props;
    let likedMovies  = [];
    if( user )
    {
      const userLikedMoviesObj = (await getLikedMovies(user._id)).data[0];
      const likedMovieIds = userLikedMoviesObj.likedMovies.map(String);
      likedMovies = movies.filter( movie => likedMovieIds.includes(movie._id));
    }
    this.setState({ likedMovies, allMovies : movies, genres });
  }


  handleMakeSuggest = () =>{
    const { allMovies, genres, likedMovies} = this.state; //refactoring
    const allGenres = genres.map(g => g.name);
    let suggestedMovies = getMovieRecommendations(likedMovies, allMovies, allGenres, 5);
    if( suggestedMovies !== null) 
    {
      console.log("not null but empty");
      this.setState({ suggestionResult : {makedSuggestion: true, suggestedMovies}});
    }
  }

  render() { 
    const {user} = this.props;
    const { likedMovies, suggestionResult, sortColumn } = this.state; 
    const { makedSuggestion, suggestedMovies} = suggestionResult;

    if (!user) return <h1 className="text-danger">First login to get Personalized Recommendations</h1>;
    if( likedMovies.length ===0) return <h1 className="text-danger"> You have zero(0) moives in your liked list.<br/> Please go and like Some movies</h1>
    return (
      <div className=" text-light ">
        <h3>This will Make personalized suggestion on the basis of ur liked movies content.</h3>
        <button className="btn-primary m-2 s-2" onClick={()=>this.handleMakeSuggest()}>Make Suggestions</button>
        {/* Rendering the pagination */}
        { makedSuggestion && <RecommendationTable movies={suggestedMovies} sortColumn={sortColumn}  onSort={this.handleSort} /> } 
    </div>
    );
  }
}
 

export default ContentBasedRecommend;
