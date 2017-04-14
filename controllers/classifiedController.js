(function(classifiedController){
    var dal =require("../sql");
    classifiedController.init= function(app,passport){
        var param={};
        app.get("/classified/",function(req,res,next){
            
            param.userId =1;
            param.heading = "test advert";
            param.categoryCode = "property";
            param.advert = "test advert for a test product";
            param.phonenumber = "123456";
           // param.emailaddress = "test1@@test.com";
        
            
            
         // dal.saveClassifiedAd(param,
           // function(result){
             
            dal.getClassifiedAds(null,
                function(data){
                    console.log(JSON.stringify((data)));
                    
                  res.render("classified/index",{title:"classified",data:data});
                
            },
                function(err){
                console.log(err)
                //res.render("classified/index",{title:"classified",data:err});
                return next(err);
                
            }
            );
            
           /*},
            function(err){
                    
                   console.log('error..');
                   return next(err);
            });
            */
           
            //saveClassifiedAd
           
            
        });
        
        app.post("/classified/save",function(req,res,next){
             
             //res.send({result:'pass'});
            //console.log('%s,%s',req.body.userId,req.params.userId);
            
            dal.saveClassifiedAd(req.body,function(data){
                    
                  //res.render("classified/index",{title:"classified",data:data});
                  res.send({error:null,result:'pass'});
                
            },
                function(err){
                console.log('error....');
                res.send({error:err,result:'fail'});
                
                //return next(err);
                
            }
            );
            
          
           
            //saveClassifiedAd
           
            
        });
        

    };
    
})(module.exports);