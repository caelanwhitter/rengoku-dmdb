/* eslint-disable max-len */
/**
 * route.js holds all the possible routes of the router and sends back data
 * @author Daniel Lam, Caelan Whitter, Danilo Zhu
 */
const express = require("express");
const router = express.Router();
const Mongoose = require("../database/mongoose");
const Movies = Mongoose.Movie;
const Reviews = Mongoose.Review;
const Submissions = Mongoose.Submission;
const ObjectId = require("mongodb").ObjectId;
const fetch = require("node-fetch");
const { BlobServiceClient } = require("@azure/storage-blob");
const bp = require("body-parser");
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const CONTAINER_NAME = "rengokublobs";
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ELEMS_PER_PAGE = 52;
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

/* ROUTES */

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
 *    tags:
 *      - Movies
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
});

/**
 * @swagger
 * /getSearch/page/{pageNumber}:
 *  get:
 *    summary: Retrieve movies per page.
 *    description: Retrieves 52 movies per specified page, minimum page is 1.
 *                 Returns the 52 movies.
 *    tags:
 *      - Movies
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
  try {
    const pageNumber = req.params.pageNumber;
    const keywordTitle = req.query.title;
    const keywordDirector = req.query.director;
    const keywordGenre = req.query.genre;
    const keywordReleaseYear = req.query.releaseYear;
    const keywordScore = req.query.score;
    const keywordRating = req.query.rating;
    const moviesPerPage = await Movies.find({
      title: { $regex: `${keywordTitle}`, $options: "i" },
      director: { $regex: `${keywordDirector}`, $options: "i" },
      genre: { $regex: `${keywordGenre}`, $options: "i" },
      releaseYear: { $regex: `${keywordReleaseYear}`, $options: "i" },
      score: { $regex: `${keywordScore}`, $options: "i" },
      rating: { $regex: `${keywordRating}`, $options: "i" },
    }).skip(ELEMS_PER_PAGE * (pageNumber - 1)).limit(ELEMS_PER_PAGE).sort({ "_id": 1 });

    const movies = await fetchMovieInfo(moviesPerPage);

    res.json(movies);
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
 *    tags:
 *      - Movies
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
 *    tags:
 *      - Reviews
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
 * /reviews:
 *  post:
 *    summary: Add a new review.
 *    description: Adds a new review to the database.
 *    tags:
 *      - Reviews
 *    security:
 *      - GoogleOAuth: [review_post]
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
 *              email:
 *                type: string
 *                example: caelanbuddy@gmail.com
 *              source:
 *                type: string
 *                example: https://lh3.googleusercontent.com/a-/AOh14GghFrmx6q-6pCnahBumONDnedLl7kAJ66o9Iuxh=s96-c
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

/**
 * @swagger
 * /reviews:
 *  delete:
 *    summary: Delete a specific review.
 *    description: Deletes a review from the database.
 *    tags:
 *      - Reviews
 *    security:
 *      - GoogleOAuth: [review_delete]
 *    requestBody:
 *      description: Delete request.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                example: 142ac939501ef9348c
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
 * fetchMovieInfo() takes in JSON of movies, loops through array, 
 * returns Promise of movie API data and waits for all Promises to be fulfilled
 * @param {JSON} movies 
 * @returns Fulfilled promises of Movie API data
 */
const fetchMovieInfo = async (movies) => {
  const requests = movies.map((movie) => {
    if ((!movie.description || movie.poster === "") && Object.keys(movie).length !== 0) {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${movie.title}&year=${movie.releaseYear}`;
      return fetchMovieDataFromApi(url, movie).then((response) => {
        return response;
      });
    }
    return movie;
  });
  return Promise.all(requests);
}

/**
 * @swagger
 * /oneMovie/updateMovieDataToAzure:
 *  post:
 *    summary: Upload new poster to Azure.
 *    description: With Request Body, 
 *                 fetches the Blob Name URL and poster and uploads it to Blob Storage.
 *    tags:
 *      - Movies
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
 * /uploadMovies:
 *  post:
 *    summary: Upload an array of Movies.
 *    description: With Request Body, 
 *                 uploads an array of Movies to the database and Azure blob storage.
 *    tags:
 *      - Movies
 *    requestBody:
 *      description: Array of movies.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              movies:
 *                type: array
 *                items:
 *                  type: object
 * 
 *    responses:
 *      '201':
 *        description: POST
 */
router.post("/uploadMovies", async (req, res) => {
  const body = await req.body;
  const movies = body.movies;

  for (let movie of movies) {

    // If movie poster field is empty or null, update DB movie to poster as null and skip to next movie
    if (!movie.poster) {
      await updateMovieDataToDB(movie._id, "", null);
      continue;
    }

    let blobData = getMovieBlobNameAndUrl(movie);
    let doesBlobExist = await containerClient.getBlockBlobClient(blobData.posterBlobName).exists();
    if (!doesBlobExist) {
      await uploadMoviePoster(blobData.posterBlobName, movie.poster);
      await updateMovieDataToDB(movie._id, movie.description, blobData.url);
    }
  }

  res.status(201).json({
    message: "POST Upload Movies Successful!"
  });
});

/**
 * @swagger
 * /oneMovie/updateMovieDataToDB:
 *  post:
 *    summary: Upload movie details to database.
 *    description: With Request Body, 
 *                 fetches description and Azure URL and uploads it to database.
 *    tags:
 *      - Movies
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
 * /hiddengems:
 *  get:
 *    summary: Retrieve all Hidden Gems.
 *    description: Returns all the Hidden Gems in the database.
 *    tags:
 *      - Hidden Gems
 *
 *    responses:
 *      '200':
 *        description: List of all Hidden Gems in the database.
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
 *                  director:
 *                    type: string
 *                    example: Caelan Whitter
 *                  title:
 *                    type: string
 *                    example: The Project
 *                  link:
 *                    type: string
 *                    example: www.google.com
 *                  description:
 *                    type: string
 *                    example: The whole process of the project
 *                  genre:
 *                    type: string
 *                    example: Thriller
 *                  duration:
 *                    type: number
 *                    minimum: 10
 *                    maximum: 500
 *                    example: 150
 *                  rating:
 *                    type: string
 *                    example: PG
 *                  releaseDate:
 *                    type: string
 *                    example: Mar 31, 2022
 */
router.get("/hiddengems", async (req, res) => {
  const hiddengem = await Submissions.find();

  try {
    res.json(hiddengem);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.sendStatus(404).end();
  }
});

/**
 * @swagger
 * /hiddengems/search?title={title}&director={director}&rating={rating}&genre={genre}:
 *  get:
 *    summary: Retrieve Hidden Gems with criteria.
 *    description: Returns the details of the Hidden Gem with the specified criteria.
 *    tags:
 *      - Hidden Gems
 * 
 *    parameters:
 *      - name: title
 *        in: query
 *        required: false
 *        description: Title of the Hidden Gem
 *        schema:
 *          type: string
 *      - name: director
 *        in: query
 *        required: false
 *        description: Director of the Hidden Gem
 *        schema:
 *          type: string
 *      - name: rating
 *        in: query
 *        required: false
 *        description: Age rating of the Hidden Gem
 *        schema:
 *          type: string
 *      - name: genre
 *        in: query
 *        required: false
 *        description: Genre of the Hidden Gem
 *        schema:
 *          type: string
 *
 *    responses:
 *      '200':
 *        description: The collection of the Hidden Gem that match the criteria.
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
 *                  director:
 *                    type: string
 *                    example: Caelan Whitter
 *                  title:
 *                    type: string
 *                    example: The Project
 *                  link:
 *                    type: string
 *                    example: www.google.com
 *                  description:
 *                    type: string
 *                    example: The whole process of the project
 *                  genre:
 *                    type: string
 *                    example: Thriller
 *                  duration:
 *                    type: number
 *                    minimum: 10
 *                    maximum: 500
 *                    example: 150
 *                  rating:
 *                    type: string
 *                    example: PG
 *                  releaseDate:
 *                    type: string
 *                    example: Mar 31, 2022
 */
router.get("/hiddengems/search", async (req, res) => {
  const hiddengems = await Submissions.find({
    title: { $regex: `${req.query.title}`, $options: "i" },
    director: { $regex: `${req.query.director}`, $options: "i" },
    genre: { $regex: `${req.query.genre}`, $options: "i" },
    rating: { $regex: `${req.query.rating}`, $options: "i" }
  });

  try {
    res.json(hiddengems);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.sendStatus(404).end();
  }
})

/**
 * @swagger
 * /hiddengems:
 *  delete:
 *    summary: Delete a specific submission.
 *    description: Deletes a submission from the database.
 *    tags:
 *      - Hidden Gems
 *    security:
 *      - GoogleOAuth: [hiddengem_delete]
 *    requestBody:
 *      description: Delete request.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                example: 142ac939501ef9348c
 * 
 *    responses:
 *      '204':
 *        description: No Content, Deleted
 */
router.delete("/hiddengems", async (req, res) => {
  const body = await req.body;

  Submissions.findByIdAndDelete(body.id, function (err) {
    if (err) {
      console.error(err);
    }
    console.log("Successfully deleted!");
    res.sendStatus(203).end();
  });
});

/**
 * @swagger
 * /hiddengems:
 *  post:
 *    summary: Add a new Hidden Gem.
 *    description: Adds a new Hidden Gem to the database.
 *    tags:
 *      - Hidden Gems
 *    security:
 *      - GoogleOAuth: [hiddengem_post]
 * 
 *    requestBody:
 *      description: Model of the submission.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *                example: I made this movie myself.
 *              director:
 *                type: string
 *                example: Xiaoju Zhu
 *              duration:
 *                type: number
 *                example: 120
 *              link:
 *                type: string
 *                example: www.google.com
 *              rating:
 *                type: string
 *                example: PG
 *              releaseDate:
 *                type: string
 *                example: Mar 31, 2022
 *              title:
 *                type: string
 *                example: Web Development
 *              genre:
 *                type: string
 *                example: Horror
 *
 *    responses:
 *      '201':
 *        description: Created
 */
router.post("/hiddengems", async (req, res) => {
  const body = await req.body;
  const hg = new Submissions({
    description: body.description,
    director: body.director,
    duration: body.duration,
    link: body.link,
    rating: body.rating,
    releaseDate: body.releaseDate,
    title: body.title,
    genre: body.genre,
    userid: body.userid
  });

  await hg.save();
  res.status(201).json({
    message: "Inserted Hidden Gem"
  });
});

/* HELPER FUNCTIONS */

/**
 * fetchMovieDataFromApi() takes in the API Query URL with movie title and year, 
 * fetches it and returns movieData of closest movie
 * @param {URL} url 
 * @param {Object} movie 
 * @returns movieData of closest movie
 */
const fetchMovieDataFromApi = async (url, movie) => {
  const response = await fetch(url);
  if (response.ok) {
    let moviesJsonApi = await response.json();
    let moviesApiResults = moviesJsonApi.results;
    let closestMovieJson = {};
    let movieData = {};

    // Calls findClosestMovieJson() algorithm to determine most similar movie from API
    closestMovieJson = await findClosestMovieJson(moviesApiResults, movie);

    // Check if algorithm found a closest movie.
    if (closestMovieJson) {

      // If there is closestMovieJson, populate movieData object with description and poster
      movieData = {
        _id: movie._id,
        title: movie.title,
        director: movie.director,
        duration: movie.duration,
        genre: movie.genre,
        gross: movie.gross,
        rating: movie.rating,
        releaseYear: movie.releaseYear,
        score: movie.score,
        poster: await returnPosterURL(movie, closestMovieJson.poster_path),
        description: closestMovieJson.overview,
      };
    } else {

      // If there is no Json of Closest Movie, leave poster and description empty
      movieData = {
        _id: movie._id,
        title: movie.title,
        director: movie.director,
        duration: movie.duration,
        genre: movie.genre,
        gross: movie.gross,
        rating: movie.rating,
        releaseYear: movie.releaseYear,
        score: movie.score,
        poster: null,
        description: "",
      };
    }
    return movieData;
  }
}

/**
 * 
 * @param {Object} movie 
 * @param {String} moviePosterPath 
 * @returns URL of the poster to the movie
 */
async function returnPosterURL(movie, moviePosterPath) {
  if (!moviePosterPath) {
    return null;
  }

  let blobData = getMovieBlobNameAndUrl(movie);
  let url = blobData.url;
  let doesBlobExist = await containerClient.getBlockBlobClient(blobData.posterBlobName).exists();
  if (!doesBlobExist) {
    let apiImageUrl = `http://image.tmdb.org/t/p/w500${moviePosterPath}`;
    url = apiImageUrl;
  }
  return url;
}

/**
 * 
 * @param {Array} moviesApiResults 
 * @param {Object} movie 
 * @returns 
 */
async function findClosestMovieJson(moviesApiResults, movie) {
  try {

    let closestMovieJson = null;
    // Checks if movie results has at least one movie. If there is, update description and poster
    if (moviesApiResults.length !== 0) {

      // Take first movie from results, most similar result
      closestMovieJson = moviesApiResults[0];

    } else {

      // If there isn't, find most similar movie based
      // on matching original movie title and closest year.
      let closestMovieResults = await fetchClosestMovies(movie.title);

      // If algorithm found other closest movies
      if (closestMovieResults.length !== 0) {
        closestMovieJson = findClosestMovie(closestMovieResults, movie.title, movie.releaseYear);
      }
    }
    return closestMovieJson;
  } catch (e) {
    return null;
  }
}

/**
 * uploadMoviePoster fetches the image from the movie poster API 
 * with the right path and uploads to Azure Blob Storage
 * @param {*} posterBlobName 
 * @param {*} moviePosterUrl 
 */
async function uploadMoviePoster(posterBlobName, moviePosterUrl) {
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
 * @param {String} movieId 
 * @param {String} movieDescription 
 * @param {String} movieBlobUrl 
 */
async function updateMovieDataToDB(movieId, movieDescription, movieBlobUrl) {
  console.log("Uploading movieBlobUrl to DB: " + movieBlobUrl);
  let fieldsToUpdate = { description: movieDescription, poster: movieBlobUrl }

  await Movies.findByIdAndUpdate(movieId, fieldsToUpdate)
}

/**
 * getMovieBlobUrl() searches for the blob and returns the Azure URL for it
 * @param {Object} movieData 
 * @returns blockBlobClient.url
 */
function getMovieBlobNameAndUrl(movieData) {
  const posterBlobName = "rengokuBlob-" + movieData.title + "-" + movieData.releaseYear + ".jpg";
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
 * @param {String} movieTitle 
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
 * @param {Array} movies 
 * @param {String} movieTitle 
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

  if (moviesWithExactTitle.length === 0) {
    return null;
  }

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
 * @param {String} firstString 
 * @param {String} secondString 
 * @returns boolean
 */
function equalsIgnoreCase(firstString, secondString) {
  return firstString.localeCompare(secondString, undefined, { sensitivity: "base" }) === 0;
}

/**
 * 
 * @param {*} movies 
 * @param {*} movieYearQuery 
 * @returns 
 */
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
