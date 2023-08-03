import React, { Component } from 'react';
import Table from "./common/table";
import { Link } from "react-router-dom";
import _ from "lodash";

class RecommendationTable extends Component {
    columns = [
        { path : "title", label: "Title",content: (movie) => <Link to={`movies/${movie._id}`}>{movie.title}</Link>, },
        { path: "genre", label: "Genre" },
        { path: "rating", label: "Rating" },
    ]


    render() { 
        const {movies, sortColumn, onSort} = this.props;
        const sorted = _.orderBy(movies, [sortColumn.path], [sortColumn.order]);
        if( sorted.length === 0) return <div><h3 className="text-warning">Sorry we don't have any suggestions for You :(</h3> <p className="text-muted"> You might have liked all movies in the DB</p></div>;
        return (
            <div>
                <h3 className="text-success"> Top {sorted.length} Suggestions... </h3>
                <Table
                columns={this.columns}
                data={sorted}
                sortColumn={sortColumn}
                onSort={onSort}
            />
            </div>
        );
    }
}
 
export default RecommendationTable;