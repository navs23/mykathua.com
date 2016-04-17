(function(homeController){

    var cheerio = require('cheerio');
    var dex =require("../helper");
    var twt =require("../helper/tweet.js");
    var data =require("../sql");
    
    
    //var mail =require("../helper/mail.js");
    //var url='http://api.openweathermap.org/data/2.5/weather?q=Kathua,in&mode=html&appid=816adfb03ad4efdaee6a6105152c3916';
    var url='http://api.openweathermap.org/data/2.5/weather?q=Kathua,in&mode=html&appid=816adfb03ad4efdaee6a6105152c3916';
   console.log('home');
    
    homeController.init= function(app){
     
        app.get("/",function(req,res,next){
            console.log('processing request for %s',req.url);
             try {
                 
            
                    dex.scrape(url,function(html){
                         twt.getTweets(function(data){
                        
                        res.render("home",{user:req.user,weather:html,tweets:data,title:"Welcome to mykathua.com"});
                     });
                },function(error){return next(error);});
             }
             catch(err){
                 console.log("error - 1");
                 console.log(err);

                 return next(err);
             }
               
        });   
           
        
        app.get("/api/users",function(req,res,next){
        
        data.getUsers(function(err,results){
            res.setHeader('Content-Type', 'application/json');
            res.send(results);
            res.end();
        
        
        });  
           
            
        });
        
        // get weather
        app.get("/api/kathuaWeather",function(req,res){
            res.send({html:'weather'});
         });
         // error handling..
          app.get("/errorpage/",function(req,res,next){
            
            //res.send({html:'done'});
             console.log(1);
            return next (new Error('error..'));
            //return next();
            
            
         },function(req,res,next){
             console.log(2);
             return next();
             
         },function(req,res){
             console.log(3);
             res.send('done');
             
         });
         
         


    };
    
var divide = function(i,j,err)    {
    
    throw err
    
}
})(module.exports);