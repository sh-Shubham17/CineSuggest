const Joi = require("joi");
const mongoose = require('mongoose');
const  Movie  = require("./movie");
const User = require("./user");

//UserLikedMovies model class
const UserLikedMovies = mongoose.model(
  "UsersLikedMovies",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likedMovies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    }]
  })
);

function validateUserLikedMovies(userLikedMovies)
//get userLikedMovies as input and validate the request whether it contails valid parameters or not
{
  const schema = {
    userId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
    addMovie: Joi.boolean().required().valid(true, false)
  };
  return Joi.validate(userLikedMovies, schema);
}

exports.UserLikedMovies  = UserLikedMovies;
exports.validate = validateUserLikedMovies;
