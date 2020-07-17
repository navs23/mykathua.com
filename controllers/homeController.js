/*
node-cache module added
*/
"use strict";
(function(mediaController) {
  const data = require("../sql");
  const twt = require("../helper/tweet.js");
  //const news = require("../news");
  const videos = require("../videos");
  const cacheMiddleware = require("../middleware/cache");
  const newsMiddleware = require("../middleware/news");
  //var newsItemCache;
  let cacheExpiryTime = process.env.cache_expiry_time || 300;

  // landing page;
  mediaController.init = function(app) {
    //console.log('db object 1 %s',app.dbNews);
    routes(app);
    //news.setNewsdb(app.dbNews);
  };

  var routes = function(app) {
    app.get(
      "/news/",
    //  cacheMiddleware(cacheExpiryTime),
    //  newsMiddleware(),
      function(req, res, next) {
        console.log("user agent %s", /mobile/i.test(req.header("user-agent")));

        let db = require("../database");
        let NewsModel = require("../database/models/newsModel");

        //news.GetNewItemsFromSql(function(err,temp){
        //   if (err==null)
        db.get(NewsModel, {})
          .then(result => {
           let model= {
              user: req.user,
              news: result,
              title:"Kathua in news, get latest national, state and kathua news on mykathua.com",
              isMobile: /mobile/i.test(req.header("user-agent"))
            };
          console.log(model);
            // videos.search({searchStr:'kathua'},function(data){
            res.render("media/news", model
             );
          })
          .catch(err => res.render(err));
      }
    );
    app.get("/videos/:name?", function(req, res, next) {
      videos.search({ searchStr: req.params.name || "kathua" }, function(data) {
        res.render("media/videos2", {
          user: req.user,
          videos: data,
          title: "Latest videos trending videos from Kathua @@mykathua.com"
        });
      });
    });
    app.get("/api/news/", 
      cacheMiddleware(cacheExpiryTime),
      newsMiddleware(),
      function(req, res, next) {
        console.log(req.url);
        let db = require("../database");
        let NewsModel = require("../database/models/newsModel");
        db.get(NewsModel, {})
          .then(result => {
            // videos.search({searchStr:'kathua'},function(data){
              res.json(result)
          })
          .catch(err => res.render(err));
      }
      //next();
    );

    app.get("/api/newsfromSQL/", function(req, res, next) {
      news.GetNewItemsFromSql(function(err, result) {
        res.send(result);
      });
      //next();
    });
    // publish local stories

    app.get("/api/stories", function(req, res) {
      //console.log(req.url);
      var param = {};
      param.storyId = req.query.storyId;
      param.showOnHomePage = req.query.showOnHomePage;

      var message = "";

      if (param.storyId == undefined) message = "invalid story Id";
      if (param.showOnHomePage == undefined) param.showOnHomePage = 0;

      if (message != "") {
        // console.log(req.query);
        res.send(req.query);
        res.end();
        return;
      }
      data.getStories(
        param,

        function(results) {
          res.send(results);
          res.end();
        },
        function(err) {
          console.log(err);
          res.render(err);
        }
      );
    });

    app.get("/api/getStory/", function(req, res) {
      //console.log(req.url);
      var param = {};
      param.storyId = req.query.storyId;

      var message = "";

      if (param.storyId == undefined) message = "invalid story Id";

      if (message != "") {
        // console.log(req.query);
        res.send(req.query);
        res.end();
        return;
      }
      data.getStory(
        param,

        function(results) {
          res.send(results);
          res.end();
        },
        function(err) {
          // console.log(err);
          res.render(err);
        }
      );
    });

    // get story comments
    app.get("/api/StoryComments/:storyId", function(req, res) {
      var storyId = req.params.storyId;
      console.log(storyId);
      var option = {};
      option.storyId = storyId;
      data.getStoryComments(option, function(err, results) {
        if (err == null) res.send(results);
        else res.send(err);
        // res.end();
      });
    });
    // end story comments
    // save comments

    app.get("/api/SaveComments/:storyId/:parent/:comments", function(
      req,
      res,
      next
    ) {
      if (req.user == undefined || req.user == null) {
        res.send({
          error: "invalid user details",
          errorMessage: "Please login to upload comments"
        });
        return;
      }

      var storyId = req.params.storyId;

      var commentData = {};
      commentData.storyId = storyId;
      commentData.parent = req.params.parent;
      commentData.username = req.user.username;
      commentData.comments = req.params.comments;
      commentData.created = new Date();

      data.saveStoryComments(commentData, function(err, results) {
        if (err == null) {
          res.send(results);
        } else {
          console.log(err);
          return next(err);
        }
      });
    });

    app.get("/api/UpVoteStoryComment/:storyId/:username", function(
      req,
      res,
      next
    ) {
      //console.log(req.url);
      var storyId = req.params.storyId;

      var commentData = {};
      commentData.storyId = storyId;

      commentData.username = req.params.username;

      data.upVoteStoryComment(
        commentData,
        function(results) {
          res.send(results);
          //res.end();
        },
        function(err) {
          console.log(err);
          //res.send(err);
          return next(err);
        }
      );
    });

    // get story comments
    app.get("/api/getTweets/", function(req, res, next) {
      try {
        twt.getTweets(function(data) {
          console.log(data);
          res.send(data);
        });
      } catch (err) {
        return next(err);
      }
    });

    app.get("/callback", function(req, res) {
      console.log("cb from twitter");
      //res.send('call back from twitter');
      //res.end();
    });

    app.get("/api/videos/:video?", function(req, res) {
      //console.log(req.params.video);
      videos.search({ searchStr: req.params.video || "kathua" }, function(
        data
      ) {
        res.send(data);
      });
    });
  };
})(module.exports);
