import React, { Component } from "react";
import { toast } from "react-toastify";
import auth from "../services/authService";
import { saveLikedMovies, getLikedMovies } from "../services/userLikedMoviesService";
import { getMovies, saveMovie } from "../services/movieService";
import LikedMoviesTable from './likedMoviesTable';

class LikedMovies extends Component {
    state = {
        likedMovies: [],
        likedMoviesObj: {},
        user : {},
        sortColumn : { path:"Rating", order:"asc"}
    }

  async componentDidMount(){
    let { data: movies } = await getMovies();
    const user = auth.getCurrentUser();
    if( user )
    {
      const likedMoviesObj = (await getLikedMovies(user._id)).data[0];
      if( likedMoviesObj )
      {
        // console.log(userLikedMoviesObj);
        movies = this.updateLikes(movies, likedMoviesObj.likedMovies);
        this.setState({likedMovies : movies, likedMoviesObj});
      }
      this.setState({user});
      // console.log(movies);
    }
  }

    updateLikes(movies, likedMoviesArray){
        const likedMovieIds = likedMoviesArray.map(String);
        return movies.filter(m =>  likedMovieIds.includes(m._id)).map(m => {m.liked = true; return m;} );
    }

    handleSort = (sortColumn) => {
      this.setState({ sortColumn });
    };

    handleLike = async (movie) => {
        //we are going to use optimistic update approach here
        const { likedMovies, likedMoviesObj, user} = this.state;
        // console.log("we are at handleLike");
        if(! user ){
          toast.error("login to use this feature.", {
            autoClose: 2000, // Set the timer to 2000 milliseconds (2 seconds)
          });
          return;
        }
        let newLikedMovies = [...likedMovies];
        const originalLikedMovies = [...likedMovies];
        const index =  likedMovies.indexOf(movie);
        // console.log("index",index);
        let movieObj = likedMovies[index] ;
        movieObj.liked = false;//disliked
        const originalLikedMoviesObj = {...likedMoviesObj};
        this.OptimisticUpdateMoviesAndUserLikedMovies(movieObj, newLikedMovies);
        try {
          await this.updateUserLikedMovies(movieObj);
          await this.updateMovieData(movieObj)
        } catch (ex) {
          if (ex.response && ex.response.status === 404)
            toast.error("failed to update.", {
              autoClose: 2000, // Set the timer to 2000 milliseconds (2 seconds)
            });
          //undoing changed coz error occured
          this.setState({ likedMovies: originalLikedMovies, likedMoviesObj: originalLikedMoviesObj });
        }
      };
    
      OptimisticUpdateMoviesAndUserLikedMovies(movieObj,  newMovies ) {
        let {likedMoviesObj : obj} = this.state;
        obj.likedMovies = obj.likedMovies.filter(mid => mid !== movieObj._id);
        newMovies = newMovies.filter( m => m._id !== movieObj._id);
        this.setState({ likedMovies: newMovies, likedMoviesObj: obj });
      }

      updateUserLikedMovies = async (movieObj) => {
        const {likedMoviesObj : obj} = this.state;
        const reqObj = { _id: obj._id,  userId : obj.userId, movieId: movieObj._id, addMovie: false};
        // console.log("Lliked?", reqObj.addMovie);
        await saveLikedMovies(reqObj);
      }
    
      updateMovieData = async (movieObj) =>{
        const movieData = {_id : movieObj._id , title : movieObj.title, genreId: movieObj.genre._id, rating: movieObj.rating, numberOfLikes: movieObj.numberOfLikes-1};
        await saveMovie(movieData);
      }

  render() {
    const { likedMovies , user, sortColumn} = this.state; 

    if (!user) return <h1 className="text-danger">First login</h1>;
    if( likedMovies.length ===0) return <h1 className="text-danger"> You have zero(0) moives in your liked list.</h1>
    return (
      <div > 
        <h3 className="text-success"> Hii {user.name} <br/>Here are your Liked Movies...</h3>
        <LikedMoviesTable
          movies ={likedMovies}
          sortColumn={sortColumn}  
          onSort={this.handleSort}
          onLike = {this.handleLike}
          />
      </div>
    );
  }
}

export default LikedMovies;
