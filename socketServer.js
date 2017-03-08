// main file

(function(socketService){
"use strict"
var socketio=require('socket.io');
const os = require('os');
var music = require('./helper/music.js');
var twt = require('./helper/tweet.js');
var io;
var geoip = require('geoip-lite'); 
var data ={};
data.connections = 0;
data.coordinates=[];
socketService.init=function(webserver){
    

 
}

socketService.start=function(webserver){

var chatUser=[];

chatUser.push('a');

io = socketio.listen(webserver);



// socket server
io.sockets.on('connection', function(socket) {
     
    data.connections++;   
   /*
    var ip = socket.request.connection._peername.address;
    ip =ip.replace('::','');
    if (ip.indexOf(':')>0)
    {
        var arr = ip.split(':');
        ip=arr[1];
    }
    var geo = geoip.lookup(ip);
   console.log(ip);
   
    data.coordinates.push({"coordinates":geo.ll})
    
    */
    socket.on('disconnect', function(s){
    
    console.log('disconnected..%s',s);
    
    data.connections--;
    
    
    });
    
    setInterval(function(){
        socket.emit('onConnect',data);
        
        socket.emit('memory',{totalmem:(os.totalmem()/1000000),freemem:(os.freemem()/1000000),connectioncount:data.connections
            ,rss:process.memoryUsage().rss/1000000
            ,heapTotal:process.memoryUsage().heapTotal/1000000
            ,heapUsed:process.memoryUsage().heapUsed/1000000
            ,external:process.memoryUsage().external/1000000
            
            
        }) ;
        
        music.listPlayingSongs(function(err,songs){
            if (err==null)
            {
                //console.log(songs);
                socket.emit('song-nowplaying',songs);
            }
            else
            console.log(err);
        });
        /*
       
        */
       
    },5*1000);
       
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
    
    setTimeout(function(){
        
         twt.getTweets(function(err,data){
     

        if (err==null)
        {
            //res.render("home",{user:req.user,weather:html,tweets:data,messages:{},title:"Welcome to mykathua.com",cmsContent:cmsContent});
     
            socket.emit('live-tweets',data);
        }
        else 
        console.log(err);
                            });
    },5*60*1000)
    
    
});

}

})(module.exports)
