/**
 * app.js sets up the express router
 * @author Daniel Lam
 */

// Required Modules
const express = require("express");
const app = express();
const route = require("./routes/route");
const path = require("path");
// const cors = require('cors');

// app.use(cors);

app.use("/api", route);

module.exports = app;
