(function(messageController){
    var data =require("../sql");
    
    messageController.init= function(app){
        
        app.get("/api/messages/",function(req,res){
            if (req.user !=undefined && req.user.name != 'undefined' && req.user.name == 'navs'){
                    data.getMessages(null,function(resultset){
                        res.send(resultset);
                        
                    },function(err){
                        
                        res.send(err);
                    });
            }
            else 
            res.send('unauthorised access');
       // res.render("message/index",{title:"message ",user:req.user});
            
         
        });

    };
    
})(module.exports);