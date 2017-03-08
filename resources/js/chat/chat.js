"use strict"
var mykathua= mykathua || {};

mykathua.Chat=function (options,socket,$){

$.extend(options,{
    
    chatMsgSendBtn:'#btnMessage',
    chatWrapper:'.chat-wrapper',
    chatUserName:'.chat-username',
    chatNewUsername:'.chat-newusername',
    chatCancelButton:'.chat-cancel',
    chatDialog:'#chat',
    chatUser:'.chat-user',
    chatmsg:'.chat-msg',
    chatmsgs:'.chat-msgs',
    connectionAnchor:'#aconnections',
    memoryUsageElement:'#divMem',
    chatError:'.chat-error'
    
});

this.username=$(options.chatNewUsername).val();
this.options=options;
this.socket=socket;
this.$=$;

this.formatMessage = function(msgjson){
     return msgjson.message;
    
    
}


};
 

mykathua.Chat.prototype.clearChatHistory=function(){
    var self=this;
    var username=self.$(self.options.chatUserName).val();
    self.$(self.options.chatNewUsername).removeAttr('disabled');
    self.$(self.options.chatUserName).val('');
    self.$(self.options.chatmsgs+' ul').empty();
    
    self.$(self.options.chatUser+' ul').empty();
    
  
    
    self.$(self.options.chatWrapper).slideUp('slow',function(){
        
      
        
    });
    
    
      self.socket.emit('chat-userleft',username);
  
}


mykathua.Chat.prototype.HideChatWrapper=function(){
    
   var self=this;
    self.$(self.options.chatWrapper).hide();
    
}

 
mykathua.Chat.prototype.init=function(){
//var socket = io();  

    var self=this;
    self.HideChatWrapper();
    
    self.$(self.options.chatMsgSendBtn).bind("click",function(){
        var m = self.$(self.options.chatmsg).val();
                
        self.$(self.options.chatmsg).val('');
                 
        self.socket.emit('chat-msg',{message:m});
             
     });

    self.$(self.options.chatNewUsername).on('click',function(){
    
    
    self.username = self.$(self.options.chatUserName).val();
   
    if (self.username != '') 
    {
        
        self.socket.emit('chat-newuser',self.username);
        
    
    }
    
    
    
});   

    self.socket.on('connect', function () { 


    self.socket.on('disconnected', function() {

            self.socket.emit('chat-userleft',self.username);

        });

    self.socket.on('onConnect',function(data){
      
       self.$(self.options.connectionAnchor).html(JSON.stringify(data) + ' live user(s) connected');
       
       
       
    });
   
    //memoryUsageElement
    
    self.socket.on('chat-users',function(users){
       
       for(var i=0;i<users.length;i++)
       self.$(self.options.chatUser + ' ul').append('<li>'+ users[i] +'</li>');
       
    });

    self.socket.on('chat-newuser',function(user){
           
           self.$(self.options.chatUser + ' ul').append('<li>'+ user +'</li>');
           
            
           
        });

    self.socket.on('chat-start',function(users){
           
         
         
         for(var i=0;i<users.length;i++)
           self.$(self.options.chatUser + ' ul').append("<li id='USERNAME_"+users[i] +"'>"+ users[i] +"</li>");
           
          
            self.$(self.options.chatWrapper).slideDown('slow',function(){});
            self.$(self.options.chatNewUsername).attr('disabled','disabled');
           
        });
    
    self.socket.on('chat-msg',function(msgjson){
        
     //alert(self.formatMessage(msgjson));
     
     if ( self.$(self.options.chatUserName).val() != '')
     {
        
        self.$(self.options.chatmsgs + ' ul').append('<li>'+ self.formatMessage(msgjson) +'</li>');
        
       
       
       
       if (self.$(self.options.chatmsgs + ' ul li').length>=20)
       {
          self.$(self.options.chatmsgs + ' ul li:first').remove();
       }
     
         
     }
     
    });
    
    self.socket.on('error-userexists',function(err){
      
     self.$(self.options.chatError).html(err);
       
       
    });

    self.socket.on('chat-userleft',function(user){
       
         //$('.chat-user ul').append('<li style="font-color:red;font-styple:italic;">'+ user +' has left the chat</li>');
         self.$(self.options.chatmsgs +' ul').append('<li><span style="font-color:red;font-styple:italic;">'+ user +' has left the chat</span></li>');
        
        self.$('ul li #USERNAME_'+ user).remove();
        
        
    });



 });
    
    self.$(self.options.chatCancelButton).on('click',function(){
    
      self.$(self.options.chatWrapper).slideUp('slow',function(){});
      
     // self.clearChatHistory();
     
});

    self.$(self.options.chatDialog).on('hidden.bs.modal', function () {
   
   
    self.clearChatHistory();
})
    
}  



