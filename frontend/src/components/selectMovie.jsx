import React from 'react';

const SelectMovie = (props) => {
    const {data, enableSuggestbtn, onSelectMovie, selectedMovieId, onMakeSuggestion } = props;
    return (         
        <div className="radio-buttons-container text-xl">
        {/* Rendering the radio buttons */}
            {data.map((movie) => (
                <div className="form-check" key={movie._id}>
                    <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id={`flexRadioDefault${movie._id}`}
                    onChange={() => onSelectMovie(movie._id)}
                    checked={movie._id === selectedMovieId}
                    />
                    <label className="form-check-label" htmlFor={`flexRadioDefault${movie._id}`}>
                    {movie.title}
                    </label>
                </div>
            ))}
            <button className="btn_primary col-2 m-3" disabled = {!enableSuggestbtn} onClick={()=> onMakeSuggestion()}> Make Suggestions</button>
        </div> 
    );
}
 
export default SelectMovie;
 