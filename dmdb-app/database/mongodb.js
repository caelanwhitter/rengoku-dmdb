/**
 * @author Danilo Zhu
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();

main().catch(err => console.err(err));

async function main() {
    await mongoose.connect(process.env.MONGODB);
}

const movie = new Schema({
    title: String,
    description: String,
    duration: String,
    genre: String,
    rating: Number,
    poster: String
});

const submission = new Schema({
    title: String,
    description: String,
    duration: String,
    genre: String,
    rating: Number,
    poster: String,
    link: String
});

const review = new Schema({
    username: String,
    content: String,
    datePosted: String
});

const user = new Schema({
    username: String,
    email: String,
    password: String
});
