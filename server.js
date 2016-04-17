// main file
var http = require("http");
var express = require("express");
var path =require("path");
//var ejsEngine=require("ejs-locals");
var passport = require('passport');
var flash    = require('connect-flash');
var methodOverride = require('method-override');
var sockethelper = require('./helper/socket.js');


var app = express();
var liveConnections=0;


require('./config/passport')(passport); // pass passport for configuration



app.configure(function() {

  console.log('configuring..')

    
  app.use('/', express.static(__dirname + '/'));
	// set up our express application
	app.set("env","development");
	app.set("liveconnections",liveConnections);


	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

  app.set("view engine","vash");


	// required for passport
	app.use(express.session({ secret: 'nav33n' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(methodOverride());
	/*
  app.use(function(err, req, res, next) {
  //do logging and user-friendly error message display
  console.log('redirecting to error handler.');
   return res.send(500, { message: err.message });
  
  });
	*/
	if (app.get('env')=="development"){

    process.env.TWITTER_CONSUMER_KEY='yBuiGvDaFlNeXdoMjaJAdjvl2';
    process.env.TWITTER_CONSUMER_SECRET='rKD8ZiJ10g5qwHnVrLghnVtDkoRb5q977FTt3N1fn1HYrOaIkY';
    process.env.TWITTER_ACCESS_TOKEN_KEY='703646797646995457-mUvHGxvX9mwrSsVa69Cy51RW3sHxwDh';
    process.env.TWITTER_ACCESS_TOKEN_SECRET='2YlEelXvhaBP9PyGV2A1QMuRnDVy9wBI98Ya0eJoFMB7E';
}
else
{
    process.env.TWITTER_CONSUMER_KEY='SQark1H85GiCfLxkqN4KHuekT';
    process.env.TWITTER_CONSUMER_SECRET='XbjoMydUrK8SbpRJN8Lpf7w7qf1zp7zFF1jJ6oFILajTLFfsrt';
    process.env.TWITTER_ACCESS_TOKEN_KEY='703646797646995457-3xgxegVvlsinnlhcwxZwLDffJdBSNuY';
    process.env.TWITTER_ACCESS_TOKEN_SECRET='WJSubhpmVHZ3XErI8kueh8TOVlPxnp8gqOeLcokryxoaV';
}

});

process.on('uncaughtException', function (err) {
  console.log(err);
  
  
})

//process.stdout.write('\033c');

var controllers = require("./controllers");

controllers.init(app,passport);


var server =http.createServer(app);

var io = sockethelper.listen(server,app);
sockethelper.start(io);


server.listen(process.env.PORT);

console.log('web server running on %d',process.env.PORT);

/// end 