(function(aboutController){
    
    aboutController.init= function(app){
        
        app.get("/about",function(req,res,next){
            
            res.render("about",{title:"About"})
            
        });
        
    };
    
})(module.exports);