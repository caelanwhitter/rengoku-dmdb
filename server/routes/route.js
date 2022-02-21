const express = require("express");
const router = express.Router();
const Movies = require("../database/mongoose");

router.get("/getAll", async (req, res) => {
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

module.exports = router;