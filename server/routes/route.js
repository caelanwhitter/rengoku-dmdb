/**
 * route.js holds all the possible routes of the router and sends back data
 * @author Daniel Lam, Caelan Whitter
 */

const express = require("express");
const router = express.Router();
const Movies = require("../database/mongoose");
const ObjectId = require("mongodb").ObjectId;
const fetch = require("node-fetch");
const { BlobServiceClient } = require('@azure/storage-blob');
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const CONTAINER_NAME = "rengokublobs";
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
require('dotenv').config();

/**
 * Start up connection to Azure Blob Storage
 */
console.log("Connecting to Azure Blob Storage...");
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
console.log("Connected to container " + CONTAINER_NAME + "!\n");

router.get("/allMovies", async (req, res) => {
    const allMovies = await Movies.find({});

    try {
        res.json(allMovies);
        res.end();
    }
    catch (error) {
        console.error(error.message);
        res.sendStatus(404).end();
    }
})

router.get("/allMovies/page/:pageNumber", async (req, res) => {
    const pageNumber = req.params.pageNumber;
    const elemsPerPage = 4;
    const moviesPerPage = await Movies.find({}).skip(elemsPerPage * (pageNumber - 1)).limit(elemsPerPage);

    try {
        res.json(moviesPerPage);
        res.end();
    }
    catch (error) {
        console.error(error.message);
        res.sendStatus(404).end();
    }
});

router.get("/oneMovie", async (req, res) => {
    const id = req.query.id;
    const singleMovie = await getOneMovieById(id);

    try {
        res.json(singleMovie);
        res.end();
    }
    catch (error) {
        console.error(error.message);
        res.sendStatus(404).end();
    }
});

router.get("/oneMovie/fetchMovieApi/:movieId", async (req, res) => {
    let movieId = req.params.movieId;
    const singleMovieArray = await getOneMovieById(movieId);
    console.log(singleMovieArray);
    let singleMovie = singleMovieArray[0];

    console.log(singleMovie);
    let movieApiJson = await fetchMovieDataFromApi(singleMovie);

    let movieTitle = movieApiJson.title;
    let movieYear = movieApiJson.year;
    const posterBlobName = 'rengokuBlob-' + movieTitle + "-" + movieYear + ".jpg";
    await uploadMoviePoster(posterBlobName, movieApiJson.poster);

    const movieBlobUrl = await getMovieBlobUrl(posterBlobName);
    console.log(movieBlobUrl);

    await updateMovieDataToDB(movieId, movieApiJson.description, movieBlobUrl);

    try {
        res.json(movieApiJson);
        res.end();
    }
    catch (error) {
        console.error(error.message);
        res.sendStatus(404).end();
    }
});

/**
 * fetchMovieDataFromApi() takes a Movie Title, fetches description and movie poster URL from backend and returns it as an object
 * @param {*} movieTitle 
 * @returns Object with description & movie poster URL
 */
async function fetchMovieDataFromApi(movie) {
    let movieTitle = movie.title;
    let movieYear = movie.releaseYear;
    let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${movieTitle}&year=${movieYear}`);
    if (response.ok) {
        let moviesJsonApi = await response.json();
        let moviesApiResults = moviesJsonApi.results;
        let movieData = {};

        // Checks if movie results has at least one movie. If there is, update description and poster
        if (moviesApiResults.length !== 0) {

            // Take first movie from results, most similar result
            let firstMovieJson = moviesApiResults[0];

            // Creates movieData object with title, description and poster
            movieData = {
                title: firstMovieJson.original_title,
                description: firstMovieJson.overview,
                poster: firstMovieJson.poster_path,
                year: movieYear,
            }
        }
        return movieData;
    }
    throw new Error('TMDB Movie API failed!');
}

/**
 * uploadMoviePoster fetches the image from the movie poster API with the right path and uploads to Azure Blob Storage
 * TO-DO: Put this function as a seperate endpoint (/oneMovie/fetchMovieApi/:movieTitle/uploadPoster)
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
        await blockBlobClient.uploadStream(imageStream, uploadOptions.bufferSize, uploadOptions.maxBuffers, options);
    }
}

/**
 * updateMovieDataToDB() find a movie by its ID, updates its description and poster
 * @param {*} movieId 
 * @param {*} movieDescription 
 * @param {*} movieBlobUrl 
 */
async function updateMovieDataToDB(movieId, movieDescription, movieBlobUrl) {
    let fieldsToUpdate = { description: movieDescription, poster: movieBlobUrl }

    await Movies.findByIdAndUpdate(movieId, fieldsToUpdate)
}

/**
 * getOneMovieById() takes an id and Mongoose returns the movie with corresponding id
 * TO-DO: replace with findById(id)
 * @param {*} id 
 * @returns singleMovie object
 */
async function getOneMovieById(id) {
    const singleMovie = await Movies.find({ "_id": new ObjectId(id) });
    return singleMovie;
}

/**
 * getMovieBlobUrl() searches for the blob and returns the Azure URL for it
 * @param {*} movieTitle 
 * @returns blockBlobClient.url
 */
async function getMovieBlobUrl(posterBlobName) {
    const blockBlobClient = containerClient.getBlockBlobClient(posterBlobName);

    return blockBlobClient.url;
}

module.exports = router;