/**
 * app.js sets up the express router
 * @author Daniel Lam
 */

// Required Modules
const express = require("express");
const app = express();
const route = require("./routes/route");
const path = require("path");

app.use(express.static(path.join(__dirname, "../dmdb-app/public")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../dmdb-app/public/index.html"))
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use("/api", route);

module.exports = app;
