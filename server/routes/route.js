/**
 * route.js holds all the possible routes of the router and sends back data
 * @author Daniel Lam, Caelan Whitter
 */

const express = require("express");
const router = express.Router();
const Movies = require("../database/mongoose");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();

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
    const elemsPerPage = 1;
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

    try {
        res.json(title);
        res.end();
    }
    catch (error) {
        console.error(error.message);
        res.sendStatus(404).end();
    }
});

module.exports = router;