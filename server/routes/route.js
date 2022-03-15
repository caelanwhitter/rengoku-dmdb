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
const { BlobServiceClient } = require('@azure/storage-blob');
const bp = require('body-parser');
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

router.use(bp.json());
router.use(bp.urlencoded({ extended: true }));

// router.get("/allMovies", async (req, res) => {
//     const allMovies = await Movies.find({});

//     try {
//         res.json(allMovies);
//         res.end();
//     }
//     catch (error) {
//         console.error(error.message);
//         res.sendStatus(404).end();
//     }
// })

router.get("/getSearch", async (req, res) => {
  const keyword = req.query.title;
  const findTitle = await Movies.find({
    title: { $regex: `${keyword}`, $options: "i"}});
  try {
    res.json(findTitle);
    res.end();
  } catch (error) {
    console.error(error.message);
    res.sendStatus(404).end();
  }
});

router.get("/getSearch/page/:pageNumber", async (req, res) => {
  const pageNumber = req.params.pageNumber;
  const keyword = req.query.title;
  const elemsPerPage = 52;
  const moviesPerPage = await Movies.find({
    title: { $regex: `${keyword}`, $options: "i"}
  }).skip(elemsPerPage * (pageNumber - 1)).limit(elemsPerPage);

  try {
    res.json(moviesPerPage);
    res.end();
  } catch (error) {
    console.error(error.message);
    res.sendStatus(404).end();
  }
})

// router.get("/allMovies/page/:pageNumber", async (req, res) => {
//     const pageNumber = req.params.pageNumber;
//     const elemsPerPage = 52;
//     const moviesPerPage = await Movies.find({}).skip(elemsPerPage * (pageNumber - 1)).limit(elemsPerPage);

//     try {
//         res.json(moviesPerPage);
//         res.end();
//     }
//     catch (error) {
//         console.error(error.message);
//         res.sendStatus(404).end();
//     }
// })

router.get("/oneMovie", async (req, res) => {
  const id = req.query.id;
  const singleMovie = await Movies.find({"_id": new ObjectId(id)});

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

  const reviewForMovie = await Reviews.find({"movieId": id});
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
  // // eslint-disable-next-line max-len
  // eslint-disable-next-line max-len
  const doc = new Reviews({username: body.username, movieId: body.movieId, content: body.content, rating: body.rating, datePosted: body.datePosted, subtitle: body.subtitle});
  await doc.save();
  res.status(201).json({
    message: "Post worked!"
  });
})

router.delete("/review/delete", async (req, res) => {
  const body = await req.body;
  Reviews.findByIdAndDelete(body.id, function (err) {
    if (err) {
      console.error(err);
    }    
    console.log("Successful deletion");
    });
});

/**
 * fetchMovieDataFromApi endpoints takes a Movie Title and Year, fetches description and movie poster URL from API and returns it as a JSON
 * @param {*} movieTitle 
 * @returns Object with description & movie poster URL
 */
router.get("/oneMovie/fetchMovieDataFromApi/", async (req, res) => {
    let movieTitle = req.query.title;
    let movieYear = req.query.year;
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
            console.log(movieData);
        }
        res.json(movieData);
        res.end();
    }
    else {
        res.status(404).send("404: Can't fetch movie data from API.");
    }
});

router.post("/oneMovie/updateMovieDataToAzure/", async (req, res) => {
    const requestBody = await req.body;

    console.log(requestBody);
    let blobData = getMovieBlobNameAndUrl(requestBody);
    await uploadMoviePoster(blobData.posterBlobName, requestBody.poster);

    res.status(201).json({
        message: "POST Updating Movie to Blob Storage succeeded!"
    });
});

router.post("/oneMovie/updateMovieDataToDB", async (req, res) => {
    const requestBody = await req.body;

    let blobData = getMovieBlobNameAndUrl(requestBody);
    await updateMovieDataToDB(requestBody.id, requestBody.description, blobData.url);

    res.status(201).json({
        message: "POST Updating Movie to Database succeeded!"
    });
});

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
function getMovieBlobNameAndUrl(movieData) {
    const posterBlobName = 'rengokuBlob-' + movieData.title + "-" + movieData.year + ".jpg";
    console.log(posterBlobName);
    const blockBlobClient = containerClient.getBlockBlobClient(posterBlobName);

    let data = {
        posterBlobName: posterBlobName,
        url: blockBlobClient.url,
    }
    return data;
}

module.exports = router;