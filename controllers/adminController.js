(function(admin){
    var data =require("../sql");
    
    admin.init=function(app){
        
        route(app);
    }
    
    
    var route=function(app){
        
        app.get('/admin/',function(req,res,next){
            
            //  if (req.isAuthenticated())
                return next();
            
             res.redirect('/login/');
            
        },function(req,res,next){
            
            res.send('maintenance goes here');
            
            
            
        });
        
    }
    
    
    
})(module.exports);