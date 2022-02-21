/**
 * Mongoose.js sets up the Mongoose ORM so it can connect the MongoDB database with routes
 * @author Daniel Lam & Mikael Baril
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();

// Connect Mongoose to MongoDB Movies (do "node server/database/mongoose.js" at root dir)
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true }, () => console.log("Connected to database!"));

//Get the default connection
let db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const movieSchema = new Schema({
    description: String,
    director: String,
    duration: String,
    genre: String,
    gross: String,
    poster: String,
    rating: String,
    releaseYear: Number,
    score: Number,
    title: String,
}, { collection: 'movies' });

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie;

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
