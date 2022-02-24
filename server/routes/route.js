/**
 * route.js holds all the possible routes of the router and sends back data
 * @author Daniel Lam
 */

const express = require("express");
const router = express.Router();
const Movies = require("../database/mongoose");

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

    const moviesPerPage = await Movies.find({}).skip(100 * (pageNumber - 1)).limit(100);

    try {
        res.json(moviesPerPage);
        res.end();
    }
    catch (error) {
        console.error(error.message);
        res.sendStatus(404).end();
    }
})

module.exports = router;