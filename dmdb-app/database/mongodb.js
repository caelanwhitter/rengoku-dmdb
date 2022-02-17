/**
 * @author Danilo Zhu
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();

mongoose.connect(process.env.ATLAS_URL);
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const movieSchema = new Schema({
    description: String,
    director:String,
    duration: String,
    genre: String,
    gross: String,
    poster: String,
    rating: String,
    releaseYear: Number,
    score: Number,
    title: String,
}, {collection: 'movies'});

const Movie = mongoose.model('Movie', movieSchema)
const queryMovies =  Movie.find();
console.log(queryMovies);

//movie.findOne(function(error, result){});

// const submission = new Schema({
//     description: String,
//     director:String,
//     duration: String,
//     genre: String,
//     gross: String,
//     poster: String,
//     rating: String,
//     releaseYear: Number,
//     score: Number,
//     title: String,
// });

// const review = new Schema({
//     username: String,
//     content: String,
//     datePosted: String
// });

// const user = new Schema({
//     username: String,
//     email: String,
//     password: String
// });
