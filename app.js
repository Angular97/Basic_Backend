var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

// routes import

const userrouter = require("./routes/user.route");

// routes declare
app.use("/api/users", userrouter);

// http://localhost:3000/api/users/register
module.exports = app;
