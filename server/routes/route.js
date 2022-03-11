/**
 * route.js holds all the possible routes of the router and sends back data
 * @author Daniel Lam
 * @author Caelan Whitter
 */

const express = require("express");
const router = express.Router();
const Movies = require("../database/mongoose");
const ObjectId = require("mongodb").ObjectId;

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
    const singleMovie = await Movies.find({
        "_id": new ObjectId(id)
    });


    try {
        res.json(singleMovie);
        res.end();
    } catch (error) {
        console.error(error.message);
        res.sendStatus(404).end();
    }
})

module.exports = router;