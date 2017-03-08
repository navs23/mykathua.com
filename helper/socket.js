(function(socketio){
    var io = require('socket.io');
    var radio =require("../helper/radio.js");
    var twt =require("../helper/tweet.js");
    var _app =null;
    socketio.listen = function(server,app){
        _app=app;
        return io.listen(server);
        
    }
    
    socketio.start= function(skt){
    
    skt.on('connection', function(socket){
        console.log('connected.');
        var i = _app.get("liveconnections");
        i++;
        _app.set("liveconnections",i);
        console.log(i);
        //socket.on('message', function(msg){
            
        //console.log(msg);
        setInterval(function(){
          radio.getDogriRadioStats(function(stats){
              
            //console.log(stats);
            var dt={}
            dt.datetime = new Date();
            skt.emit('message', stats);  
              
          },function(err){
           console.log(err);
              
          });
        
        
          
      },3000);  
        
        socket.on('disconnect', function(){
            console.log('disconnected.');
            var i = _app.get("liveconnections");
            i--;
            _app.set("liveconnections",i);
        
        });     
        
        });
   
    
    //});
    
    }
    
})(module.exports );