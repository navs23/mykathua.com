(function(musicController){
    
    var cheerio = require('cheerio');
    var data =require("../sql");
    var dex =require("../helper");
    var radio =require("../helper/radio.js");
    
    var title ="A blend of DOGRI folk and hindi music, just sit back and enjoy your favorite music on DOGRI Radio.";
    
    musicController.init= function(app){
        
        app.get("/music/",function(req,res){
       
      //RenderFMRadio(1,function(html){
           
            res.render("music/index",{title:title,"user":req.user,"html":""});
            
            
       });
       
        app.get("/api/dogriRadio/CurrentSong/",function(req,res,next){
        
        radio.getDogriRadioStats(function(data){res.send(data);},function(err){
        
       next(err);
       
        
        
        });  
            
         });

    };
    
    
   
    
})(module.exports);