const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const request = require("request");
const exphbs = require("express-handlebars");
var helpers = require('handlebars-helpers')();


const app = express()
const PORT = process.env.PORT || 8080;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const controller = require("./controller/articles_controller.js")(app);
// app.use('/', controller)

mongoose.Promise = Promise;
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/atl15");


app.listen(PORT, function(){
    console.log("App running on port " + PORT)
});