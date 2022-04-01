/* eslint-disable max-len */
/**
 * route.js holds all the possible routes of the router and sends back data
 * @author Daniel Lam, Caelan Whitter
 */
const express = require("express");
const router = express.Router();
const Mongoose = require("../database/mongoose");
const Movies = Mongoose.Movie;
const Reviews = Mongoose.Review;
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

/**
 * @swagger
 * /getSearch?title={title}&director={director}&genre={genre}&releaseYear={releaseYear}&score={score}&rating={rating}:
 *  get:
 *    summary: Retrieve every movie.
 *    description: Used when loading the Movies page with no search parameters.
 *                 Retrieves a list of movies matching the parameters specified, 
 *                 if no parameters are specified, retrieves every movie.
 *                 If a certain parameter is not needed, it must absolutely be empty, 
 *                 thus no double-quotes, single-quotes or anything the like.
 *    parameters:
 *      - name: title
 *        in: query
 *        required: false
 *        description: Movie title.
 *        allowEmptyValue: true 
 *        schema:
 *          type: string
 *      - name: director
 *        in: query
 *        require: false
 *        description: Director of the movie.
 *        allowEmptyValue: true 
 *        schema:
 *          type: string
 *      - name: genre
 *        in: query
 *        required: false
 *        description: Movie genre.
 *        allowEmptyValue: true 
 *        schema:
 *          type: string
 *      - name: releaseYear
 *        in: query
 *        require: false
 *        description: Year of release of the movie.
 *        allowEmptyValue: true 
 *        schema:
 *          type: integer
 *          minimum: 1980
 *          maximum: 2020
 *      - name: score
 *        in: query
 *        require: false
 *        description: Overall score given by reviewers to the movie.
 *        allowEmptyValue: true 
 *        schema:
 *          type: string
 *      - name: rating
 *        in: query
 *        require: false
 *        description: Rating of the movie (Adults, teens or everyone).
 *        allowEmptyValue: true
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: A list of movies that match the parameters specified, if no parameters, every movie.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    example: 62378512c6d65605e4778633
 *                  description:
 *                    type: string
 *                    example: Paranormal investigators Ed and Lorraine Warren work to help 
 *                             a family terrorized by a dark presence in their farmhouse. Forced to 
 *                             confront a powerful entity, the Warrens find themselves caught in the 
 *                             most terrifying case of their lives.
 *                  director:
 *                    type: string
 *                    example: James Wan
 *                  duration:
 *                    type: string
 *                    example: 112.0
 *                  genre:
 *                    type: string
 *                    example: Horror
 *                  gross:
 *                    type: string
 *                    example: $320,290,989.00
 *                  poster:
 *                    type: string
 *                    example: https://rengokudmdb.blob.core.windows.net/rengokublobs/rengokuBlob-The%20Conjuring-2013.jpg
 *                  rating:
 *                    type: string
 *                    example: R
 *                  releaseYear:
 *                    type: string
 *                    example: 2013
 *                  score:
 *                    type: string
 *                    example: 7.5
 *                  title:
 *                    type: string
 *                    example: The Conjuring
*/
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

/**
 * @swagger
 * /getSearch/page/{pageNumber}:
 *  get:
 *    summary: Retrieve movies per page.
 *    description: Retrieves 52 movies per specified page, minimum page is 1.
 *                 Returns the 52 movies.
 *    parameters:
 *      - name: pageNumber
 *        in: path
 *        required: true
 *        description: Page number.
 *        schema:
 *          type: integer
 *          minimum: 1
 * 
 *    responses:
 *      '200':
 *        description: A list of movies that match the page specified.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    example: The Conjuring
 *                  director:
 *                    type: string
 *                    example: James Wan
 *                  genre:
 *                    type: string
 *                    example: Horror
 *                  releaseYear:
 *                    type: string
 *                    example: 2013
 *                  score:
 *                    type: string
 *                    example: 7.5
 *                  rating:
 *                    type: string
 *                    example: R
 */
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

/**
 * @swagger
 * /oneMovie?id={id}:
 *  get:
 *    summary: Retrieve movie by ID.
 *    description: Returns the details of the movie with the specified ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID of the movie.
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: One single movie that matches the ID specified.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  example: 62378512c6d65605e4778633
 *                description:
 *                  type: string
 *                  example: Paranormal investigators Ed and Lorraine Warren work to help 
 *                           a family terrorized by a dark presence in their farmhouse. Forced to 
 *                           confront a powerful entity, the Warrens find themselves caught in the 
 *                           most terrifying case of their lives.
 *                director:
 *                  type: string
 *                  example: James Wan
 *                duration:
 *                  type: string
 *                  example: 112.0
 *                genre:
 *                  type: string
 *                  example: Horror
 *                gross:
 *                  type: string
 *                  example: $320,290,989.00
 *                poster:
 *                  type: string
 *                  example: https://rengokudmdb.blob.core.windows.net/rengokublobs/rengokuBlob-The%20Conjuring-2013.jpg
 *                rating:
 *                  type: string
 *                  example: R
 *                releaseYear:
 *                  type: string
 *                  example: 2013
 *                score:
 *                  type: string
 *                  example: 7.5
 *                title:
 *                  type: string
 *                  example: The Conjuring
 */
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

/**
 * @swagger
 * /oneMovie/reviews?id={id}:
 *  get:
 *    summary: Retrieve reviews from movie by ID.
 *    description: Returns the reviews of the movie with the specified ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID of the movie.
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: The reviews of the movie that matches the ID specified.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    example: 6245df834793b57bfafa5b1f
 *                  username:
 *                    type: string
 *                    example: Caelan Whitter
 *                  email:
 *                    type: string
 *                    example: caelanwhitter@gmail.com
 *                  source:
 *                    type: string
 *                    example: https://lh3.googleusercontent.com/a/AATXAJzqxP70inc0scd2Y4JOwv4QHg4xlXIT1uY6m5sb=s96-c
 *                  movieid:
 *                    type: string
 *                    example: 62378512c6d65605e4776dce
 *                  subtitle:
 *                    type: string
 *                    example: Good movie
 *                  content:
 *                    type: string
 *                    example: I really enjoyed this movie.
 *                  rating:
 *                    type: integer
 *                    minimum: 0
 *                    maximum: 10
 *                    example: 0
 *                  datePosted:
 *                    type: string
 *                    example: Mar 31, 2022
 *                  __v:
 *                    type: number
 *                    example: 0
 */
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

/**
 * @swagger
 * /oneMovie/fetchMovieDataFromApi?title={title}&year={year}:
 *  get:
 *    summary: Retrieve description and poster.
 *    description: Takes a Movie title and year, then
 *                 Fetches description and movie poster URL from API and returns it as a JSON.
 *    parameters:
 *      - name: title
 *        in: query
 *        required: true
 *        description: Title of the movie.
 *        schema:
 *          type: string 
 *          example: The Conjuring
 *      - name: year
 *        in: query
 *        required: false
 *        allowEmptyValue: true
 *        description: Year of release of the movie.
 *        schema:
 *          type: integer
 *          minimum: 1980
 *          maximum: 2020
 *          example: 2013
 * 
 *    responses:
 *      '200':
 *        description: One single movie that matches the title and year specified.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  example: The Conjuring
 *                description:
 *                  type: string
 *                  example: Paranormal investigators Ed and Lorraine Warren work to help 
 *                           a family terrorized by a dark presence in their farmhouse. Forced to 
 *                           confront a powerful entity, the Warrens find themselves caught in the 
 *                           most terrifying case of their lives.
 *                poster:
 *                  type: string
 *                  example: /wVYREutTvI2tmxr6ujrHT704wGF.jpg
 *                year:
 *                  type: integer
 *                  nullable: true
 *                  minimum: 1980
 *                  maximum: 2020
 *                  example: 2013
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
 * @swagger
 * /oneMovie/updateMovieDataToAzure:
 *  post:
 *    summary: Upload new poster to Azure.
 *    description: With Request Body, 
 *                 fetches the Blob Name URL and poster and uploads it to Blob Storage.
 *    requestBody:
 *      description: Model of the movie.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                example: The Conjuring
 *              description: 
 *                type: string
 *                example: Paranormal investigators Ed and Lorraine Warren work to help 
 *                         a family terrorized by a dark presence in their farmhouse. Forced to 
 *                         confront a powerful entity, the Warrens find themselves caught in the 
 *                         most terrifying case of their lives.
 *              year: 
 *                type: integer
 *                minimum: 1980
 *                maximum: 2020
 *                example: 2013
 *              poster:
 *                type: string
 *                example: /wVYREutTvI2tmxr6ujrHT704wGF.jpg
 * 
 *    responses:
 *      '201':
 *        description: Created
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
 * @swagger
 * /oneMovie/updateMovieDataToDB:
 *  post:
 *    summary: Upload movie details to database.
 *    description: With Request Body, 
 *                 fetches description and Azure URL and uploads it to database.
 *    requestBody:
 *      description: Model of the movie.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                example: 62378512c6d65605e4776dce
 *              title:
 *                type: string
 *                example: The Conjuring
 *              description: 
 *                type: string
 *                example: Paranormal investigators Ed and Lorraine Warren work to help 
 *                         a family terrorized by a dark presence in their farmhouse. Forced to 
 *                         confront a powerful entity, the Warrens find themselves caught in the 
 *                         most terrifying case of their lives.
 *              year: 
 *                type: integer
 *                minimum: 1980
 *                maximum: 2020
 *                example: 2013
 *              poster:
 *                type: string
 *                example: /wVYREutTvI2tmxr6ujrHT704wGF.jpg
 * 
 *    responses:
 *      '201':
 *        description: Created
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
 * @swagger
 * /reviews:
 *  post:
 *    summary: Add a new review.
 *    description: Adds a new review to the database.
 *    requestBody:
 *      description: Model of the review.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: Caelan Whitter
 *              movieId:
 *                type: string
 *                example: 62378512c6d65605e4776dce
 *              subtitle: 
 *                type: string
 *                example: Great movie!
 *              content: 
 *                type: string
 *                example: It was a great movie to relax to.
 *              rating:
 *                type: number
 *                example: 4
 *              datePosted:
 *                type: string
 *                example: Mar 31, 2022
 * 
 *    responses:
 *      '201':
 *        description: Created
 */
router.post("/reviews", async (req, res) => {
  const body = await req.body;
  const doc = new Reviews({
    username: body.username,
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

/**
 * @swagger
 * /reviews:
 *  delete:
 *    summary: Delete a specific review.
 *    description: Deletes a review from the database.
 * 
 *    responses:
 *      '204':
 *        description: No Content, Deleted
 */
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