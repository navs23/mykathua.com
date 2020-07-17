// main file
"use strict";
const http = require("http");
const express = require("express");
const path = require("path");

//var ejsEngine=require("ejs-locals");
const color = require("colors");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
//var sockethelper = require('./helper/socket.js');
const bodyParser = require("body-parser");
const emailHelper = require("./helper/mail.js");
const auth = require("./helper/auth.js");
const cacheExpiryTime = process.env.cache_expiry_time || 300;
const socketService = require("./socketServer.js");

const app = express();
const liveConnections = 0;

require("./config/passport")(passport); // pass passport for configuration
app.set("env", "development");
app.set("liveconnections", liveConnections);
app.auth = auth;
app.use("/", express.static(__dirname + "/"));
app.use(express.logger("dev")); // log every request to the console
app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(express.bodyParser()); // get information from html forms

app.set("view engine", "vash");

// required for passport
app.use(express.session({ secret: "nav33n" })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(methodOverride());

console.log("env is %s".blue, process.env.NODE_ENV || "development");

if (process.env.NODE_ENV || "development") {
  process.env.TWITTER_CONSUMER_KEY = "yBuiGvDaFlNeXdoMjaJAdjvl2";
  process.env.TWITTER_CONSUMER_SECRET =
    "rKD8ZiJ10g5qwHnVrLghnVtDkoRb5q977FTt3N1fn1HYrOaIkY";
  process.env.TWITTER_ACCESS_TOKEN_KEY =
    "703646797646995457-mUvHGxvX9mwrSsVa69Cy51RW3sHxwDh";
  process.env.TWITTER_ACCESS_TOKEN_SECRET =
    "2YlEelXvhaBP9PyGV2A1QMuRnDVy9wBI98Ya0eJoFMB7E";
  process.env.SENDGRID_API_KEY = "d1H4OpMPSn-P3wEpGR6g1A";
  process.env.GOOGLE_API_KEY = "AIzaSyDc2SwSwRntH9m1e21OL8btHcxl3TPwwI0";

  process.env.SENDGRID_USER = "mykathua";

  process.env.BASE_WEBSITE_URL =
    "https://navs-navs23.c9users.io/account/confirm/";

  process.env.mode = "debug";

  process.env.pricecheckindiaKey = "EQBSKJNCPNHSHCOP";
  process.env.pricecheckindiaUsername = "navshotm";
}

process.on("uncaughtException", function(err) {
  console.log("an unhandelled exception has occurred \n %s", err);
  /*
  emailHelper.sendMail({
      from:'do-not-reply@mykathua.com',
      to:'navs@hotmail.co.uk',
      subject:'mykathua.com->error',
      text:JSON.stringify(err)
      
      
  });
  */
});

function wwwRedirect(req, res, next) {
  if (req.headers.host.slice(0, 4) === "www.") {
    var newHost = req.headers.host.slice(4);
    return res.redirect(301, req.protocol + "://" + newHost + req.originalUrl);
  }
  next();
}

var controllers = require("./controllers");

controllers.init(app, passport);

var server = http.createServer(app);

console.log("starting socket io server ".blue);

socketService.start(server);

server.listen(process.env.PORT);
