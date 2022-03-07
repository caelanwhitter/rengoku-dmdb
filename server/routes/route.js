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
    const singleMovie = await Movies.find({ "_id": new ObjectId(id) });

    try {
        res.json(singleMovie);
        res.end();
    }
    catch (error) {
        console.error(error.message);
        res.sendStatus(404).end();
    }
});

router.get("/oneMovie/fetchMovieApi/:movieTitle", async (req, res) => {
    const title = req.params.movieTitle;
    let movieApiJson = await fetchMovieDataFromApi(title);

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
async function fetchMovieDataFromApi(movieTitle) {
    let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${movieTitle}`);
    if (response.ok) {
        let moviesJsonApi = await response.json();
        let moviesApiResults = moviesJsonApi.results;
        let movieData = {};

        // Checks if movie results has at least one movie. If there is, update description and poster
        if (moviesApiResults.length !== 0) {
            let firstMovieJson = moviesApiResults[0];

            movieData = {
                title: firstMovieJson.original_title,
                description: firstMovieJson.overview,
                poster: firstMovieJson.poster_path,
            }
            fetchMoviePoster(movieData.title, movieData.poster);
        }
        return movieData;
    }
    throw new Error('TMDB Movie API failed!');
}

/**
 * fetchMoviePoster fetches the image from the movie poster API with the right path and uploads to Azure Blob Storage
 * @param {*} movieTitle 
 * @param {*} moviePosterPath 
 */
async function fetchMoviePoster(movieTitle, moviePosterPath) {
    let moviePosterUrl = `http://image.tmdb.org/t/p/w500${moviePosterPath}`;
    let response = await fetch(moviePosterUrl);
    if (response.ok) {

        // Return the response as a blob and turn it into a Readeable stream
        const image = await response.blob();
        const imageStream = image.stream();

        // Create a unique name for the blob
        const posterBlobName = 'rengokuBlob-' + movieTitle + ".jpg";

        const blockBlobClient = containerClient.getBlockBlobClient(posterBlobName);

        // set mimetype as determined from browser with images
        const options = { blobHTTPHeaders: { blobContentType: "image/jpeg" } };

        // Upload blob to container
        await blockBlobClient.uploadStream(imageStream, uploadOptions.bufferSize, uploadOptions.maxBuffers, options);
    }
}

module.exports = router;