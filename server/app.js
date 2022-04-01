/**
 * app.js sets up the express router
 * @author Daniel Lam
 */

// Required Modules
const express = require("express");
const app = express();
const route = require("./routes/route");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DMDB Express API with Swagger",
      version: "0.1.0",
      description:
        "Made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "DMDB",
        url: "https://dmdb-project.herokuapp.com",
        email: "daniel.lam@dawsoncollege.qc.ca",
      },
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "API server"
      },
    ],
  },
  apis: ["./server/server.js", "./server/routes/route.js"],
};

const specs = swaggerJSDoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.use(express.static(path.join(__dirname, "../dmdb-app/build")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use("/api", route);

module.exports = app;
