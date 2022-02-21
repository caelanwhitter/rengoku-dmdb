const express = require("express");
const router = express.Router();

router.get("/getAll", async (req, res) => {
    res.send("getAll page");
})

module.exports = router;