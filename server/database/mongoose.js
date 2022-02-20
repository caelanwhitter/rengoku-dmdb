/**
 * @author Danilo Zhu
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();

let uri = process.env.ATLAS_URI;

// Connect Mongoose to MongoDB Movies
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true}, () => "Connected to database!");

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

Movie.find({}, function(err, movies) {
    if (err) throw err;

    console.log(movies);
})

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
