const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const omdb = require("./router/omdb");
const color = require("colors");

const app = express();

// It is present in .env file.
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("common"));
app.use(helmet());
app.set("view engine", "ejs");

app.use(expressLayout);

app.use(express.static("views"));
app.use("/", omdb);

app.listen(PORT, () => {
  console.log(color.black.bgWhite(`Server is started at http://localhost:${PORT}`));
});
