//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleSchema = {
  title: String,
  content: String

};

const Article = mongoose.model("Article", articleSchema);



app.route("/articles")


  .get(function(req, res) {

    Article.find({}, function(err, foundArticles) {

      if (err) {
        console.log(err);
      } else {
        res.send(foundArticles);

      }

    });

  })


  .post(function(req, res) {

    let newArticle = new Article({

      title: req.body.title,
      content: req.body.content

    });

    newArticle.save(function(err) {

      if (err) {
        console.log(err);
      } else {
        res.send("Added new atricle");
      }

    });



  })


  .delete(function(req, res) {

    Article.deleteMany({}, function(err) {

      if (err) {

        console.log(err);
      } else {

        console.log("All documents deleted");
      }

    });




  });


  app.route("/articles/:articleName")


  .get(function(req,res){

  articlesName = req.params.articleName;

  Article.findOne({"title" : articlesName},function(err,result){

if(err){
  console.log(err);
}else{
  if(!result){
    console.log("No Article Found");
  }else{

    res.send(result);
  }

}

  });



  })

  .put(function(req,res){

articlesName = req.params.articleName;


Article.update({"title" : articlesName},
{"title" : req.body.title,"content" : req.body.content},
{overwrite : true},
function(err,results){
if(err){
  console.log(err);
}else{
  console.log(results);
  res.send("Updated Article");
}

});




})


.patch(function(req,res){

articlesName = req.params.articleName;

Article.update({"title" : articlesName},{ $set : req.body },
function(err){

  if(err){
    console.log(err);
  }else{
    console.log("Updated element (patch)");
    res.send("Updated element (patch)");
  }
});



})


.delete(function(req,res){

articlesName = req.params.articleName;

Article.deleteOne({"title" : articlesName},function(err){

if(err){
  console.log(err);
}else{

  res.send("Deleted Article");
}

});


});







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
