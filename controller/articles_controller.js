const express = require("express");
const db = require ("../models");
const axios = require("axios");
const cheerio = require("cheerio");
var bodyParser = require("body-parser");
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));



module.exports = function (app) {
    app.get("/articles", function(req, res) {
        console.log("hello")
        db.Article.find({})
        .then((data)=> {
            var hbsObject = {
                articles: data
            };
            console.log(hbsObject);
            res.render("index", hbsObject);
        })
    })
    app.get("/scrape", function(req, res) {
        axios.get("http://www.theatlantic.com/").then(function(response){
            const $ = cheerio.load(response.data);
    
            $("article").each(function(i, element) {
                const result = {};
    
                result.title = $(this)
                .children("div")
                .children("h2")
                .children("a")
                .text();
                result.link = $(this)
                .children("div")
                .children("h2")
                .children("a")
                .attr("href");
                result.desc = $(this)
                .children("div")
                .children("p")
                .text();
                
    
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
    
    

// app.get("/articles", function(req, res){
//     db.Article.find()
//     .then(function(dbArticle){
//         res.json(dbArticle)
//     })
//     .catch(function(err){
//         res.json(err);
//     });
// });

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
// app.get("/articles/:id", function(req, res){
//     db.Article.findOne({ _id: req.params.id })
//     .populate("note")
//         .then(function(dbArticle){
//         res.json(dbArticle)
//     })
//     .then((data)=> {
//         var hbsNote = {
//             note: data
//         };
//         console.log(hbsNote);
//         res.render(hbsNote);
//     })
//     .catch(function(err){
//         res.json(err);
//     });
// });

app.post("/articles/:id", function(req, res) {
    console.log(req.body)
    db.Note.create(req.body)
    
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

// app.post("/articles/:id", function(req, res){
//     db.Note.create(req.body)
//     .then(function(dbNote){
//         return Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
//     })
//     .then(function(dbArticle) {
//         res.json(dbArticle)
//     })
//     .catch(function(err){
//         res.json(err);
//     });
// });

}


