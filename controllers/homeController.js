(function(homeController){

    var cheerio = require('cheerio');
    var dex =require("../helper");
    var twt =require("../helper/tweet.js");
    var dal =require("../sql");
    
    
    //var url='http://api.openweathermap.org/data/2.5/weather?q=Kathua,in&mode=html&appid=816adfb03ad4efdaee6a6105152c3916';
    var url='http://api.openweathermap.org/data/2.5/weather?q=Kathua,in&mode=html&appid=816adfb03ad4efdaee6a6105152c3916';
   
    homeController.init= function(app){
        
        app.get("/",function(req,res,next){
           
            var ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
            var params={url:req.url,ipaddress:ip};
            savewebhits(params);
            
            
             try {
                 
            
                    dex.scrape(url,function(html){
                         twt.getTweets(function(err,data){

                    if (err==null)
                    res.render("home",{user:req.user,weather:html,tweets:data,messages:{},title:"Welcome to mykathua.com"});
                    else 
                    return next();
                        
                     });
                },function(error){return next(error);});
             }
             catch(err){
                 
                 console.log(err);

                 return next(err);
             }
               
        });   
           
        app.get("/stats/",function(req,res,next){
            
            dal.getWebHit(null,function(data){
            
                res.send(data);    
                
            },function(err){
                res.send(err);
                
            });
            
            
        });
        app.get("/api/users",function(req,res,next){
        
        dal.getUsers(function(err,results){
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
            
            return next (new Error('error..'));
            //return next();
            
            
         },function(req,res,next){
             
             return next();
             
         },function(req,res){
             
             res.send('done');
             
         });
         
         app.post("/contactus",function(req,res){
             
            var message='';
             dal.saveMessage(req.body,function(res){
                 message="done";
                 
             },function (err) {
                 
                 console.log(err);
                 message=err.message;
             });
            
             console.log(req.body);
             
             res.send(message);
             
         });
    
        // test
         app.get("/test/message/",function(req,res){
             
            
             dal.getMessages(function(err,msg){
             if (err==null)
             res.send(msg);
             else
             res.send(err);
                 
             });
            
             
             
             
             
         });
    
         
    };
    
var savewebhits=function(params){
    
    dal.saveWebHit(params,function(result){ },function(err){console.log(err);    });
}
})(module.exports);