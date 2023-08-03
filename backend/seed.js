const { Genre } = require("./models/genre");
const { Movie } = require("./models/movie");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Comedy",
    movies: [
      { title: "Airplane", numberOfLikes: 5, rating: 2 },
      { title: "The Hangover", numberOfLikes: 10, rating: 2 },
      { title: "Wedding Crashers", numberOfLikes: 15, rating: 2 },
    ],
  },
  {
    name: "Action",
    movies: [
      { title: "Die Hard", numberOfLikes: 5, rating: 2 },
      { title: "Terminator", numberOfLikes: 10, rating: 2 },
      { title: "The Avengers", numberOfLikes: 15, rating: 2 },
    ],
  },
  {
    name: "Romance",
    movies: [
      { title: "The Notebook", numberOfLikes: 5, rating: 2 },
      { title: "When Harry Met Sally", numberOfLikes: 10, rating: 2 },
      { title: "Pretty Woman", numberOfLikes: 15, rating: 2 },
    ],
  },
  {
    name: "Thriller",
    movies: [
      { title: "The Sixth Sense", numberOfLikes: 5, rating: 2 },
      { title: "Gone Girl", numberOfLikes: 10, rating: 2 },
      { title: "The Others", numberOfLikes: 15, rating: 2 },
    ],
  },
];

async function seed() {
  await mongoose.connect(config.get("db"));

  await Movie.deleteMany({});
  await Genre.deleteMany({});

  for (let genre of data) {
    const { _id: genreId } = await new Genre({ name: genre.name }).save();
    const movies = genre.movies.map((movie) => ({
      ...movie,
      genre: { _id: genreId, name: genre.name },
    }));
    await Movie.insertMany(movies);
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
