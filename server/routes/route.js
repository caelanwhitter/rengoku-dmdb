/**
 * route.js holds all the possible routes of the router and sends back data
 * @author Daniel Lam, Caelan Whitter
 */
const express = require("express");
const router = express.Router();
const Mongoose = require("../database/mongoose");
const Movies = Mongoose.Movie;
const Reviews = Mongoose.Review;
const User = Mongoose.User;
const ObjectId = require("mongodb").ObjectId;
const fetch = require("node-fetch");
const { BlobServiceClient } = require("@azure/storage-blob");
const bp = require("body-parser");
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const CONTAINER_NAME = "rengokublobs";
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
require("dotenv").config();

/**
 * Start up connection to Azure Blob Storage
 */

console.log("Connecting to Azure Blob Storage...");
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
console.log("Connected to container " + CONTAINER_NAME + "!\n");

router.use(bp.json());
router.use(bp.urlencoded({ extended: true }));


router.get("/getSearch", async (req, res) => {
  const keywordTitle = req.query.title;
  const keywordDirector = req.query.director;
  const keywordGenre = req.query.genre;
  const keywordReleaseYear = req.query.releaseYear;
  const keywordScore = req.query.score;
  const keywordRating = req.query.rating;
  const findMovies = await Movies.find({
    title: { $regex: `${keywordTitle}`, $options: "i" },
    director: { $regex: `${keywordDirector}`, $options: "i" },
    genre: { $regex: `${keywordGenre}`, $options: "i" },
    releaseYear: { $regex: `${keywordReleaseYear}`, $options: "i" },
    score: { $regex: `${keywordScore}`, $options: "i" },
    rating: { $regex: `${keywordRating}`, $options: "i" },
  })

  try {
    res.json(findMovies);
    res.end();
  } catch (error) {
    console.error(error.message);
    res.sendStatus(404).end();
  }
})
router.get("/getSearch/page/:pageNumber", async (req, res) => {
  const pageNumber = req.params.pageNumber;
  const keywordTitle = req.query.title;
  const keywordDirector = req.query.director;
  const keywordGenre = req.query.genre;
  const keywordReleaseYear = req.query.releaseYear;
  const keywordScore = req.query.score;
  const keywordRating = req.query.rating;
  const elemsPerPage = 52;
  const moviesPerPage = await Movies.find({
    title: { $regex: `${keywordTitle}`, $options: "i" },
    director: { $regex: `${keywordDirector}`, $options: "i" },
    genre: { $regex: `${keywordGenre}`, $options: "i" },
    releaseYear: { $regex: `${keywordReleaseYear}`, $options: "i" },
    score: { $regex: `${keywordScore}`, $options: "i" },
    rating: { $regex: `${keywordRating}`, $options: "i" },
  }).skip(elemsPerPage * (pageNumber - 1)).limit(elemsPerPage);

  try {
    res.json(moviesPerPage);
    res.end();
  } catch (error) {
    console.error(error.message);
    res.sendStatus(404).end();
  }
})

router.get("/oneMovie", async (req, res) => {
  const id = req.query.id;
  const singleMovie = await Movies.find({ "_id": new ObjectId(id) });

  try {
    res.json(singleMovie);
    res.end();
  } catch (error) {
    console.error(error.message);
    res.sendStatus(404).end();
  }
})

router.get("/oneMovie/reviews", async (req, res) => {
  const id = req.query.id;

  const reviewForMovie = await Reviews.find({ "movieId": id });
  try {
    res.json(reviewForMovie);
    res.end();
  } catch (error) {
    console.error(error.message);
    res.sendStatus(404).end();
  }
})


router.post("/reviews", async (req, res) => {
  const body = await req.body;
  const doc = new Reviews({
    username: body.username,
    email: body.email,
    source: body.source,
    movieId: body.movieId,
    content: body.content,
    rating: body.rating,
    datePosted: body.datePosted,
    subtitle: body.subtitle
  });
  await doc.save();
  res.status(201).json({
    message: "Post worked!"
  });
})


router.delete("/review/delete", async (req) => {
  const body = await req.body;
  Reviews.findByIdAndDelete(body.id, function (err) {
    if (err) {
      console.error(err);
    }
    console.log("Successful deletion");
  });
});

/**
 * fetchMovieDataFromApi endpoint takes a Movie Title and Year, 
 * fetches description and movie poster URL from API and returns it as a JSON
 */
router.get("/oneMovie/fetchMovieDataFromApi/", async (req, res) => {
  let movieTitle = req.query.title;
  let movieYear = parseInt(req.query.year);
  // eslint-disable-next-line max-len
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${movieTitle}&year=${movieYear}`;

  let response = await fetch(url);
  try {
    if (response.ok) {
      let moviesJsonApi = await response.json();
      let moviesApiResults = moviesJsonApi.results;
      let closestMovieJson = {};
      let movieData = {};

      // Checks if movie results has at least one movie. If there is, update description and poster
      if (moviesApiResults.length !== 0) {
        // Take first movie from results, most similar result
        closestMovieJson = moviesApiResults[0];
        // If there isn't, find most similar movie based 
        // on matching original movie title and closest year.
      } else {
        let closestMovieResults = await fetchClosestMovies(movieTitle);
        closestMovieJson = findClosestMovie(closestMovieResults, movieTitle, movieYear);
      }

      // Creates movieData object with title, description and poster
      movieData = {
        title: closestMovieJson.title,
        description: closestMovieJson.overview,
        poster: closestMovieJson.poster_path,
        year: movieYear,
      }
      res.json(movieData);
      res.end();
    } else {
      throw new Error("404: Response not OK");
    }
  } catch (e) {
    res.status(404).send("404: Movie API Fetch Failed!");
  }
});

/**
 * updateMovieDataToAzure endpoint takes the Request Body, 
 * fetches the Blob Name URL and poster and uploads it to Blob Storage
 */
router.post("/oneMovie/updateMovieDataToAzure/", async (req, res) => {
  const requestBody = await req.body;

  let blobData = getMovieBlobNameAndUrl(requestBody);
  await uploadMoviePoster(blobData.posterBlobName, requestBody.poster);

  res.status(201).json({
    message: "POST Updating Movie to Blob Storage succeeded!"
  });
});

/**
 * updateMovieDataToDB endpoint takes request Body, 
 * fetches description and Azure URL and uploads it to database
 */
router.post("/oneMovie/updateMovieDataToDB", async (req, res) => {
  const requestBody = await req.body;

  let blobData = getMovieBlobNameAndUrl(requestBody);

  // Checks if poster url is null (aka no movie poster). 
  // If it is, upload null to DB instead of blobData.url
  if (!requestBody.poster) {
    blobData.url = null;
  }
  await updateMovieDataToDB(requestBody.id, requestBody.description, blobData.url);

  res.status(201).json({
    message: "POST Updating Movie to Database succeeded!"
  });
});


/**
 * uploadMoviePoster fetches the image from the movie poster API 
 * with the right path and uploads to Azure Blob Storage
 * @param {*} movieTitle 
 * @param {*} moviePosterPath 
 */
async function uploadMoviePoster(posterBlobName, moviePosterPath) {
  let moviePosterUrl = `http://image.tmdb.org/t/p/w500${moviePosterPath}`;
  let response = await fetch(moviePosterUrl);
  if (response.ok) {

    // Return the response as a blob and turn it into a Readeable stream
    const image = await response.blob();
    const imageStream = image.stream();

    // Create a unique name for the blob
    const blockBlobClient = containerClient.getBlockBlobClient(posterBlobName);

    // set mimetype as determined from browser with images
    const options = { blobHTTPHeaders: { blobContentType: "image/jpeg" } };

    // Upload blob to container
    await blockBlobClient.uploadStream(imageStream,
      uploadOptions.bufferSize, uploadOptions.maxBuffers, options);
  }
}

/**
 * updateMovieDataToDB() find a movie by its ID, updates its description and poster
 * @param {*} movieId 
 * @param {*} movieDescription 
 * @param {*} movieBlobUrl 
 */
async function updateMovieDataToDB(movieId, movieDescription, movieBlobUrl) {
  console.log("Uploading movieBlobUrl to DB: " + movieBlobUrl);
  let fieldsToUpdate = { description: movieDescription, poster: movieBlobUrl }

  await Movies.findByIdAndUpdate(movieId, fieldsToUpdate)
}

/**
 * getMovieBlobUrl() searches for the blob and returns the Azure URL for it
 * @param {*} movieTitle 
 * @returns blockBlobClient.url
 */
function getMovieBlobNameAndUrl(movieData) {
  const posterBlobName = "rengokuBlob-" + movieData.title + "-" + movieData.year + ".jpg";
  const blockBlobClient = containerClient.getBlockBlobClient(posterBlobName);

  let data = {
    posterBlobName: posterBlobName,
    url: blockBlobClient.url,
  }
  return data;
}

/**
 * fetchClosestMovies() takes a title and fetches a generalized query to the API querying 
 * by title and returning the results array
 * @param {*} movieTitle 
 * @returns results
 */
async function fetchClosestMovies(movieTitle) {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${movieTitle}`
  let response = await fetch(url);
  if (response.ok) {
    let movieApiJson = await response.json();
    let moviesApiResults = movieApiJson.results;
    return moviesApiResults;
  } else {
    throw new Error("Failed to query movie title only");
  }
}

/**
 * findClosestMovie() loops through movies array, filters only the ones 
 * with exact title and valid year and returns movie with closest matching year
 * @param {*} movies 
 * @param {*} movieTitle 
 * @param {*} movieYearQuery 
 * @returns movie
 */
function findClosestMovie(movies, movieTitle, movieYearQuery) {
  let moviesWithExactTitle = [];
  movies.forEach((movie) => {
    if (equalsIgnoreCase(movie.original_title, movieTitle) && movie.release_date) {
      moviesWithExactTitle.push(movie);
    }
  });

  let closestMovie = findClosestMovieByYear(moviesWithExactTitle, movieYearQuery);

  return closestMovie;
}

/**
 * parseReleaseYear() is a helper method that 
 * takes movie API date string (YYYY-MM-DD), parses it as a year and returns it
 * @param {*} releaseDate 
 * @returns year
 */
function parseReleaseYear(releaseDate) {
  return parseInt(releaseDate.substring(0, 3));
}

/**
 * equalsIgnoreCase is a helper method that returns true if both string matches (case insensitive)
 * @param {*} firstString 
 * @param {*} secondString 
 * @returns boolean
 */
function equalsIgnoreCase(firstString, secondString) {
  return firstString.localeCompare(secondString, undefined, { sensitivity: "base" }) === 0;
}

function findClosestMovieByYear(movies, movieYearQuery) {
  let closestMovie = movies[0];
  let closestMovieYear = parseReleaseYear(closestMovie.release_date);
  movies.forEach((movie) => {
    let formattedMovieYear = parseReleaseYear(movie.release_date);
    if (Math.abs(movieYearQuery - formattedMovieYear)
      < Math.abs(movieYearQuery - closestMovieYear)) {
      closestMovie = movie;
      closestMovieYear = parseReleaseYear(closestMovie.release_date);
    }
  });
  return closestMovie;
}

module.exports = router;