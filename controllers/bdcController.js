(function(admin){
    var data =require("../sql/cms.js");
     var cmsData;
    admin.init=function(app){
        
       
           setTimeout(function(){
            console.log('setting up admin routes');   
            route(app);    
               
           },500);
           
    }
    
    
    var route=function(app){
       
        app.get('/bdc/registration/',function(req,res,next){
            
            
           //   if (req.isAuthenticated())
                return next();
          //  else 
            // res.redirect('/login/');
            
        },function(req,res,next){
            
             data.getWebsiteContentByPageAndSection(null,function(err,content){
               if (err==null)
               cmsData=content;
               else
               cmsData=[];
               // render admin page
                res.render('community/bdcRegistration/',{user:req.user,cmsData:cmsData});
               console.log(cmsData);
           });
           
           
            
        });
        
        
        app.get('/bdc/',function(req,res,next){
            
               res.render("bdc/index",{user:req.user});
            
            
        });
        
        
       
        
        
    }
    
    
    
    
    
})(module.exports);