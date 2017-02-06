// main file
"use strict"
var http = require("http");
var express = require("express");
var path =require("path");

//var ejsEngine=require("ejs-locals");
var passport = require('passport');
var flash    = require('connect-flash');
var methodOverride = require('method-override');
//var sockethelper = require('./helper/socket.js');

var emailHelper = require('./helper/mail.js');
var auth = require('./helper/auth.js');
var music = require('./helper/music.js');
const os = require('os');

var app = express();
var liveConnections=0;

var chatUser=[];

chatUser.push('a');

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

    app.use('/', express.static(__dirname + '/'));
    
	// set up our express application
	app.set("env","development");
	app.set("liveconnections",liveConnections);
    app.auth=auth;
   
    //console.log(JSON.stringify(app.auth));

   // app.use(logger.log);
	
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
	//app.use(auth.isLoggedIn);
	
	if (app.get('env')=="development"){

    process.env.TWITTER_CONSUMER_KEY='yBuiGvDaFlNeXdoMjaJAdjvl2';
    process.env.TWITTER_CONSUMER_SECRET='rKD8ZiJ10g5qwHnVrLghnVtDkoRb5q977FTt3N1fn1HYrOaIkY';
    process.env.TWITTER_ACCESS_TOKEN_KEY='703646797646995457-mUvHGxvX9mwrSsVa69Cy51RW3sHxwDh';
    process.env.TWITTER_ACCESS_TOKEN_SECRET='2YlEelXvhaBP9PyGV2A1QMuRnDVy9wBI98Ya0eJoFMB7E';
    process.env.SENDGRID_API_KEY='d1H4OpMPSn-P3wEpGR6g1A';
    process.env.GOOGLE_API_KEY='AIzaSyDc2SwSwRntH9m1e21OL8btHcxl3TPwwI0';
     
    process.env.SENDGRID_USER='mykathua';
    
    process.env.BASE_WEBSITE_URL='https://navs-navs23.c9users.io';
}
else
{
    process.env.TWITTER_CONSUMER_KEY='SQark1H85GiCfLxkqN4KHuekT';
    process.env.TWITTER_CONSUMER_SECRET='XbjoMydUrK8SbpRJN8Lpf7w7qf1zp7zFF1jJ6oFILajTLFfsrt';
    process.env.TWITTER_ACCESS_TOKEN_KEY='703646797646995457-3xgxegVvlsinnlhcwxZwLDffJdBSNuY';
    process.env.TWITTER_ACCESS_TOKEN_SECRET='WJSubhpmVHZ3XErI8kueh8TOVlPxnp8gqOeLcokryxoaV';
    process.env.SENDGRID_API_KEY='d1H4OpMPSn-P3wEpGR6g1A';
    process.env.SENDGRID_USER='mykathua';
    process.env.BASE_WEBSITE_URL='http://www.mykathua.com';
    process.env.GOOGLE_API_KEY='AIzaSyDc2SwSwRntH9m1e21OL8btHcxl3TPwwI0';
}

});

process.on('uncaughtException', function (err) {
  console.log('an unhandelled exception has occurred \n %s',err);
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
    if (req.headers.host.slice(0, 4) === 'www.') {
        var newHost = req.headers.host.slice(4);
        return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
    }
    next();
};

var controllers = require("./controllers");

controllers.init(app,passport);


var server =http.createServer(app);


console.log('starting socket io server ');


 
var io = require('socket.io').listen(server);

var connections=0;

var i=1;
// socket server
io.sockets.on('connection', function(socket) {
       
    console.log('connected..,%s',connections);
    connections++;
    
    socket.on('disconnect', function(s){
    
    console.log('disconnected..%s',s);
    console.log('connected..,%s',connections);
    
    
    
    connections--;
        
    
    });
    
    setInterval(function(){
       
        socket.emit('ConnCount',connections);
        
        socket.emit('memory',{totalmem:(os.totalmem()/1024)/1024,freemem:(os.freemem()/1024)/1024}) ;
        
        music.listPlayingSongs(function(err,songs){
            if (err==null)
            {
                //console.log(songs);
                socket.emit('song-nowplaying',songs);
            }
            else
            console.log(err);
        });
        
        
       
      
        
       
    },3*1000);
       
    socket.on('chat-newuser',function(user){
     
     var index=chatUser.indexOf(user);
     console.log('checking if user %s already exists or not %s',user,index);
      if( index >=0)
      {
         
          socket.emit('error-userexists','Username taken by another user');
          return ;
      }
     
     
     chatUser.push(user);
     
     //socket.emit('chat-users',chatUser);
     
     //io.emit('chat-newuser',chatUser);
     socket.broadcast.emit('chat-newuser',user);
     
     socket.emit('chat-start',chatUser);
     
     
    });
    
    socket.on('chat-user',function(data){
        
        // send it back to all connected clients
        data.messageTime = Date();
        
        console.log('new msg has arrived %s @ %s',data.message,data.messageTime);
        
        socket.emit('chat-user',data);
        
        
       
    });
    
    socket.on('chat-msg',function(data){
        
        // send it back to all connected clients
        data.messageTime = Date();
        
        console.log('new msg has arrived %s @ %s',data.message,data.messageTime);
        
       socket.emit('chat-msg',data);
        //io.broadcast.emit('chat-msg', data);
       
    });
    
    socket.on('chat-userleft',function(user){
       
       console.log('%s left @%s',user,chatUser.indexOf(user));
       
       var i = chatUser.indexOf(user);
        if(i != -1) {
        chatUser.splice(i, 1);
        }
       
       
       //console.log('users %s',chatUser);
       socket.broadcast.emit('chat-userleft',user);
       
      
       
    });
    
    
});




server.listen(process.env.PORT);