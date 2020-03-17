const express = require("express");
const route = express.Router();
const axios = require("axios");
require("dotenv").config();
const con = require("../model/db");
const color = require("colors")

// It is present in .env file.
const API_KEY = process.env.API_KEY;

con.connect(err => {
  if (err) throw err.message;
  console.log(color.bgYellow.black("Connected To MySQL!"));
});

// Index Route
route.get("/", (req, res) => {
  res.render("index", {
    title: "IMDB",
    error: ""
  });
});

// Request Post Route
route.post("/search", (req, res) => {
  if (req.body.url !== "") {
    var imdbID = req.body.url;
    var id = imdbID.split("/");
    imdbID = id[id.length - 2];

    // Validating
    if (imdbID.length === 9) {
      res.redirect(`/search/${imdbID}`);
    } else {
      res.render("index", {
        title: "IMDB",
        error: "URL Is Invaild!"
      });
    }
  } else {
    res.render("index", {
      title: "IMDB",
      error: "URL Field Is Missing *"
    });
  }
});

// Respose Route
route.get("/search/:id", async (req, res) => {
  var imdbID = req.params.id;
  axios
    .get(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`)
    .then(async respose => {
      const data = await respose.data;
      if (data.Response !== "False") {
        const API = {
          Title: data.Title,
          Plot: data.Plot,
          Director: data.Director,
          Writer: data.Writer,
          Stars: data.Actors,
          Rating: data.Ratings
        };

        API.Rating = JSON.stringify(API.Rating);

        var sql =
          "INSERT INTO viewed(Title,Plot,Director,Writer,Stars,Rating) VALUES (?,?,?,?,?,?)";

        con.query(
          sql,
          [
            API.Title,
            API.Plot,
            API.Director,
            API.Writer,
            API.Stars,
            API.Rating
          ],
          (err, result) => {
            if (err) throw err.message;
            console.log("Number of records inserted: " + result.affectedRows);
          }
        );

        API.Rating = JSON.parse(API.Rating);

        res.status(200).json(API);
      } else {
        res.status(400).json(data);
      }
    })
    .catch(err => {
      if (err) throw err;
    });
});

module.exports = route;
