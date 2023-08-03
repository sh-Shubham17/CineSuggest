const { UserLikedMovies, validate } = require("../models/userLikedMovies");
const {User} = require("../models/user");
const {Movie} = require("../models/movie");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const usersLikedMovies = await UserLikedMovies.find().select("-__v").sort("userId");
  res.send(usersLikedMovies);
});

//to get userliked movies using user id not object id
router.get("/:id", validateObjectId, async (req, res) => {
  const getUserId = mongoose.Types.ObjectId(req.params.id);
  const userLikedMovies = await UserLikedMovies.find({userId: getUserId}).select("-__v");
// console.log(userLikedMovies, ",", getUserId);
  if (!userLikedMovies)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(userLikedMovies);
  //console.log("result of get",userLikedMovies);
});


router.post("/", [auth],  async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie Id.");

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("Invalid user Id.");

  const userLikedMovies = new UserLikedMovies();
  userLikedMovies.userId = req.body.userId;
  userLikedMovies.likedMovies = [req.body.movieId];
  await userLikedMovies.save();
  console.log("we are in post");
  res.send(userLikedMovies);
});



router.put("/:id", [auth], async (req, res) => {
  // console.log("in post");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // console.log("validation of body passed");
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie Id.");

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("Invalid user Id.");
  // console.log("validation of movie passed");
  const userLikedMovies = await UserLikedMovies.findById(req.params.id);

  if (!userLikedMovies)
    return res.status(404).send("Wrong put request! Seems like user have never liked any movie before.");

  let likedMoviesArray = userLikedMovies.likedMovies;
  if( req.body.addMovie ){
      if( !isMovieAlreadyLiked(req.body.movieId, likedMoviesArray)){
        likedMoviesArray.push(req.body.movieId);
      }
  }
  else {
    //coz movieId in request body is is of string type
    const reqMovieId = mongoose.Types.ObjectId(req.body.movieId);
    const index = likedMoviesArray.indexOf(reqMovieId);
    likedMoviesArray.splice(index,1);
    console.log( req.body.movieId, likedMoviesArray, likedMoviesArray.indexOf(req.body.movieId)  );
  }
  userLikedMovies['likedMovies'] = likedMoviesArray;
  console.log(userLikedMovies);
  const updatedUserLikedMovies = await UserLikedMovies.findByIdAndUpdate(req.params.id, userLikedMovies);
  res.send(updatedUserLikedMovies);
});

function isMovieAlreadyLiked(movieId, likedMoviesArray) {
  // Convert the array of object IDs to a regular array of strings
  const likedMovieIds = likedMoviesArray.map(String);

  // Check if the movie ID exists in the array
  return likedMovieIds.includes(movieId);
}


//here [auth, admin] are 2 middleware functions auth: if authenticated and admin : if admin , so if authenticated and if admin then only delete movie will be possible
router.delete("/:id", [auth, admin], async (req, res) => {
  const userLikedMovies = await UserLikedMovies.findByIdAndRemove(req.params.id);

  if (!userLikedMovies)
    return res.status(404).send("No data found for particular Id in UserLikedMovies.");

  res.send(userLikedMovies);
});


module.exports = router;
