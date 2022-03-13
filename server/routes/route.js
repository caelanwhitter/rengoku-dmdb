/**
 * route.js holds all the possible routes of the router and sends back data
 * @author Daniel Lam
 * @author Caelan Whitter
 */

const express = require("express");
const router = express.Router();
const Mongoose = require("../database/mongoose");
const Movies = Mongoose.Movie;
const Reviews = Mongoose.Review;
const ObjectId = require("mongodb").ObjectId;
const bp = require("body-parser");
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
    if(err) {
      console.error(err);
    }
    console.log("Successful deletion");
  });
 
})

module.exports = router;