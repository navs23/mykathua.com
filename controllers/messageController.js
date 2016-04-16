(function(messageController){
    
    messageController.init= function(app){
        
        app.get("/message/",function(req,res){
            
        res.render("message/index",{title:"message ",user:req.user});
            
         
        });

    };
    
})(module.exports);