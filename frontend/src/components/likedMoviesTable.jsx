import React, { Component } from 'react';
import Table from "./common/table";
import { Link } from "react-router-dom";
import Like from "./common/like";
import _ from "lodash";

class LikedMoviesTable extends Component {
    columns = [
    {
      path: "title",
      label: "Title",
      content: (movie) => <Link to={`movies/${movie._id}`}>{movie.title}</Link>,
    },
    { path: "genre.name", label: "Genre" },
    { path: "rating", label: "Rating" },
    { path: "numberOfLikes", label: "Likes" },
    {
      key: "like", //content here is function now
      content: (movie) => (
        <Like
          liked={movie.liked}
          onClick={() => this.props.onLike(movie)}
        />
      ),
    }, //this is same as x = <Like></Like> in jsx
  ]; //end of column object


    render() { 
        const { movies, sortColumn, onSort} = this.props;
        const sortedMovies = _.orderBy(movies, [sortColumn.path], [sortColumn.order]);
        return (
            <Table
            columns={this.columns}
            data={sortedMovies}
            sortColumn={sortColumn}
            onSort={onSort}
        />
        );
    }
}
 
export default LikedMoviesTable;