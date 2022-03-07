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
require('dotenv').config();

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

async function fetchMoviePoster(movieTitle, moviePosterPath) {
    let moviePosterUrl = `http://image.tmdb.org/t/p/w500${moviePosterPath}`;
    let response = await fetch(moviePosterUrl);
    if (response.ok) {

        const image = await response.blob();

        console.log(image);

        // Create a unique name for the blob
        const posterBlobName = 'rengokuBlob-' + movieTitle + ".jpg";

        const blockBlobClient = containerClient.getBlockBlobClient(posterBlobName);

        console.log('\nUploading to Azure storage as blob:\n\t', posterBlobName);

        // set mimetype as determined from browser with file upload control
        //const options = { blobHTTPHeaders: { blobContentType: file.type } };

        // Upload data to blob
        await blockBlobClient.uploadData(image);
    }
}

async function connectToBlobStorageContainer() {
    console.log("Connecting to Azure Blob Storage...");
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    console.log("Connected to container " + CONTAINER_NAME + "!\n");
}

module.exports = router;