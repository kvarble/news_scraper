const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const app = express()
const PORT = process.env.PORT || 8080;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/news_scraper");

app.get("/scrape", function(req, res) {
    axios.get("https://www.mprnews.org/").then(function(response){
        const $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
            const result = {};

            result.title = $(this)
            .children("p")
            .text();
            result.link = $(this)
            .children("p")
            .attr("href");

            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err){
                    return res.json(err);
                })
        })
        res.send("Scrape Complete");
    });
});

app.get("/articles/:id", function(req, res){
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle)
    })
    .catch(function(err){
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id}, { new: true })
    })
    .then(function(dbArticle) {
        res.json(dbArticle)
    })
    .catch(function(err){
        res.json(err);
    });
});

app.listen(PORT, function(){
    console.log("App running on port " + PORT)
});