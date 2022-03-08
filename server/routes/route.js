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
})
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
  console.log(body);
  res.status(201).json({
    message: "Post worked!"
  });
})

router.delete("/review/delete", async (req, res) => {
  const body = await req.body;
  console.log(ObjectId(body.id));
  Reviews.findByIdAndDelete(body.id, function (err) {
    if(err) {
      console.error(err);
    }
    console.log("Successful deletion");
  });
 
})

module.exports = router;