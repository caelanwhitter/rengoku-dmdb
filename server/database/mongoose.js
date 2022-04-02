/**
 * Mongoose.js sets up the Mongoose ORM so it can connect the MongoDB database with routes
 * @author Daniel Lam, Mikael Baril, Caelan Whitter & Danilo Zhu
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config();

// Connect Mongoose to MongoDB Movies (do "node server/database/mongoose.js" at root dir)
// eslint-disable-next-line max-len
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true });

//Get the default connection
let db = mongoose.connection;
console.log("Connected to database!\n");

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const movieSchema = new Schema({
  description: String,
  director: String,
  duration: String,
  genre: String,
  gross: String,
  poster: String,
  rating: String,
  releaseYear: String,
  score: String,
  title: String,
}, { collection: "movies" });

const Movie = mongoose.model("Movie", movieSchema)

const reviewSchema = new Schema({
  username: String,
  email: String,
  source: String,
  movieId: String,
  subtitle: String,
  content: String,
  rating: Number,
  datePosted: String
}, { collection: "reviews" });

const Review = mongoose.model("Review", reviewSchema)

const userSchema = new Schema({
  name: String,
  email: String,
  source: String,
}, { collection:"users"});

const User = mongoose.model("User", userSchema)

const submissionSchema = new Schema({
  description: String,
  director: String,
  duration: Number,
  link: String,
  rating: String,
  releaseDate: String,
  title: String
}, { collection: "submissions" });

const Submission = mongoose.model("Submission", submissionSchema)

module.exports = { Movie, Review, User, Submission };

