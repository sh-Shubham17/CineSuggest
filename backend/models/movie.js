const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
//Movie model class
const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberOfLikes: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  })
);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberOfLikes: Joi.number().min(0).required(),
    rating: Joi.number().min(0).max(10).required(),
  };
  return Joi.validate(movie, schema);
}
//exporting model class Movie to create its objects and work on interval
exports.Movie = Movie;
exports.validate = validateMovie;
