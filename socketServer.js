// main file

(function(socketService){
"use strict"
var socketio=require('socket.io');
const os = require('os');
var music = require('./helper/music.js');
var twt = require('./helper/tweet.js');
var colors = require('colors');
var io;
var geoip = require('geoip-lite'); 
var data =[];
var pageVisitor=[
    {name:'home',vistorCount:0},
    {name:'news',vistorCount:0},
    {name:'video',vistorCount:0},
    {name:'music',vistorCount:0},
    {name:'job',vistorCount:0},
    {name:'gallery',vistorCount:0},
    {name:'contacts',vistorCount:0},
    {name:'trainstatus',vistorCount:0},
    ];
socketService.init=function(webserver){
    

 
}

function indexOf(data,key,value)
{
    var retval =-1;
for (var i in data)
{
    
    if ((data[i][key])==value)
    {
        retval = i;
        break;
    }
}
return retval;
}

socketService.start=function(webserver){

var chatUser=[];

chatUser.push('a');

io = socketio.listen(webserver);



// socket server
io.sockets.on('connection', function(socket) {
     
     //console.log('connected'.green,socket.handshake.url);
     var item={};
     var req=socket.request;
     if(req)
     {
        item.ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;
     
     if (indexOf(data,'ip',item.ip) == -1)
        {
       var geo = geoip.lookup(item.ip);
       
       if (geo != undefined || geo != null){
       item.coordinates=geo.ll;
       item.data=geo;
       }
       
        data.push(item);
   }
     }
    io.sockets.emit('onConnect',data);
    
    socket.on('disconnect', function(socket){
        
   // data.connections--;
     
     
    
    });
    
    setInterval(function(){
      
        
        socket.emit('memory',{totalmem:(os.totalmem()/1000000),freemem:(os.freemem()/1000000),connectioncount:data.length
            ,rss:process.memoryUsage().rss/1000000
            ,heapTotal:process.memoryUsage().heapTotal/1000000
            ,heapUsed:process.memoryUsage().heapUsed/1000000
            ,external:process.memoryUsage().external/1000000
            ,data:data
            ,pageVisitor:pageVisitor
            
        }) ;
        /*
        music.listPlayingSongs(function(err,songs){
            if (err==null)
            {
                //console.log(songs);
                socket.emit('song-nowplaying',songs);
            }
            else
            console.log(err);
        });
        */
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
    
    socket.on('page',function(data){
         console.log('%s',JSON.stringify(data));
         var index=-1;
        for(var i =0;i<pageVisitor.length;i++)
        {
            if (pageVisitor[i].name== data.pagename)
            {
            index=i;
            break;
            }
        }
        
        if (data.event=='arrived')
        {
            
            pageVisitor[index].vistorCount<0?1:pageVisitor[index].vistorCount++;
        }
        else
        {
            pageVisitor[index].vistorCount<=0?0:pageVisitor[index].vistorCount--;
        }
        
        console.log('%s',JSON.stringify(pageVisitor[index]));
        io.sockets.emit('visitor-count',pageVisitor[index]);
        
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
