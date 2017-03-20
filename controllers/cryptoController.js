(function(crypto){
    var scraper = require("../helper/scraper");
    var uri ='http://capfeed.com/json';
    
    
    crypto.init = function(app){
        
        route(app);
        
    }
    
    
     function getPrice(ccy,cb){
        if (ccy)
        uri ='http://capfeed.com/json?c=' + ccy;
        
        scraper.getHttpResponse({uri:uri },function(err,res){
            if (err) 
            cb(err,null);
            else
            cb(null,res.body);
        });
        
    }
    
    
    function route(app)
    {
        app.get('/market/',function(req,res,next){
            
            getPrice(null,function(err,json){
                if (err) next();
                
                else 
                {
                //console.log(json);
                //res.send(JSON.parse(json));
               res.render('crypto/index',{marketdata:JSON.parse(json)});
                
                }
                
            });
            
            
        })
        
        
    }
    
    
}(module.exports))