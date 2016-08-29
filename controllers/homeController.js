(function(homeController){

    var cheerio = require('cheerio');
    var dex =require("../helper");
    var twt =require("../helper/tweet.js");
    var dal = require("../sql");
    var cms =require("../sql/cms.js");
    var emailHelper = require('../helper/mail.js');
    //var url='http://api.openweathermap.org/data/2.5/weather?q=Kathua,in&mode=html&appid=816adfb03ad4efdaee6a6105152c3916';
    var url='http://api.openweathermap.org/data/2.5/weather?q=Kathua,in&mode=html&appid=816adfb03ad4efdaee6a6105152c3916';
   
   
    homeController.init= function(app){
        
         setupRoutes(app);    
       
        
    };
    
var savewebhits=function(params){
    
    dal.saveWebHit(params,function(result){ },function(err){console.log(err);    });
}

var setupRoutes=function(app){
       app.get("/",function(req,res,next){
           
           
            var ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
            var params={url:req.url,ipaddress:ip};
            //savewebhits(params);
            
             var cmsContent={};
       
            cms.getWebsiteContentByPageAndSection({page:'home',section:'top-header'},function(err,value){
                
                
            if (err==null){cmsContent.cmsTopHeader=value[0].content;
            }
                cms.getWebsiteContentByPageAndSection({page:'home',section:'flash'},function(err,value){
                    
                
                if (err==null){
                cmsContent.flashMessage=value[0].content;
                
                }
              
            });    
            
        });
            
            
             try {
                    dex.scrape(url,function(html){
                    
                         twt.getTweets(function(err,data){

                            if (err==null)
                            {
                                res.render("home",{user:req.user,weather:html,tweets:data,messages:{},title:"Welcome to mykathua.com",cmsContent:cmsContent});
                                console.log(data);
                            }
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
             
            console.log('email %s',JSON.stringify(req.body));
           //  dal.saveMessage(req.body,function(err,res){
               //  param=res;
                 emailHelper.sendEmail(
            {
                from: req.body.email,
                to: 'navs@hotmail.co.uk',
                subject: 'mykathua.com->message from ' + req.body.name,
                html: req.body.message
        });
                 
                 
           //  },function (err) {
                 
               //  console.log(err);
               //  param.message=err.message;
            // });
        
             res.send({code:200,message:'message sent successfully'});
             
         });
    
        // test
         app.get("/test/executesql/",function(req,res){
             
            
             dal.executeSql(function(err,msg){
             if (err==null)
             res.send(msg);
             else
             res.send(err);
                 
             });
            
             
             
             
             
         });
    
}

})(module.exports);