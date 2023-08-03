// Function to calculate similarity between movie titles using cosine similarity
function cosineSimilarityString(titleA, titleB) {
  // Convert titles to lowercase and split into words
  const wordsA = titleA.toLowerCase().split(" ");
  const wordsB = titleB.toLowerCase().split(" ");

  // Create a set to store unique words from both titles
  const uniqueWords = new Set([...wordsA, ...wordsB]);

  // Count the number of occurrences of each word in both titles
  const vectorA = Array.from(
    uniqueWords,
    (word) => wordsA.filter((w) => w === word).length
  );
  const vectorB = Array.from(
    uniqueWords,
    (word) => wordsB.filter((w) => w === word).length
  );

  // Calculate the dot product of the word count vectors
  const dotProduct = vectorA.reduce(
    (acc, countA, index) => acc + countA * vectorB[index],
    0
  );

  // Calculate the magnitudes of the word count vectors
  const magnitudeA = Math.sqrt(
    vectorA.reduce((acc, count) => acc + count * count, 0)
  );
  const magnitudeB = Math.sqrt(
    vectorB.reduce((acc, count) => acc + count * count, 0)
  );

  // Calculate the cosine similarity for titles
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to convert genre string to one-hot encoding
function encodeGenre(genre, allGenres) {
  const encodedGenre = new Array(allGenres.length).fill(0);
  const genreIndex = allGenres.indexOf(genre);
  if (genreIndex !== -1) {
    encodedGenre[genreIndex] = 1;
  }
  return encodedGenre;
}

// Function to calculate cosine similarity between two movies
function cosineSimilarity(movieA, movieB, allGenres) {
  // Convert genre strings to one-hot encoding
  const genreA = encodeGenre(movieA.genre, allGenres);
  const genreB = encodeGenre(movieB.genre, allGenres);

  // Calculate the dot product of two vectors
  const dotProduct =
    genreA.reduce((acc, val, index) => acc + val * genreB[index], 0) +
    movieA.rating * movieB.rating +
    cosineSimilarityString(movieA.title, movieB.title);

  // Calculate the magnitudes of each vector
  const magnitudeA = Math.sqrt(
    genreA.reduce((acc, val) => acc + val * val, 0) +
      movieA.rating * movieA.rating +
      cosineSimilarityString(movieA.title, movieA.title)
  );
  const magnitudeB = Math.sqrt(
    genreB.reduce((acc, val) => acc + val * val, 0) +
      movieB.rating * movieB.rating +
      cosineSimilarityString(movieB.title, movieB.title)
  );

  // Calculate the cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to get movie recommendations based on cosine similarity
export function getMovieRecommendations(
  inputMovie,
  allMovies,
  allGenres,
  numRecommendations
) {
  console.log("before calulation");
  // Calculate cosine similarity between the input movie and all other movies
  const similarities = allMovies.map((movie) => ({
    movie,
    similarity: cosineSimilarity(inputMovie, movie, allGenres),
  }));

  console.log("before sorting");
  // Sort the movies based on similarity in descending order
  similarities.sort((a, b) => b.similarity - a.similarity);

  console.log("before returning");
  // Get the top N recommended movies
  return similarities.slice(1, numRecommendations + 1).map((sim) => sim.movie);
}
