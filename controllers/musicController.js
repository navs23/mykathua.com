(function(musicController){
    
    var cheerio = require('cheerio');
    var data =require("../sql");
    var dex =require("../helper");
    var radio =require("../helper/radio.js");
    var music = require('../helper/music.js');
    var title ="Just sit back and enjoy music from the best internet radion stations across the world at mykathua.com";
    
    musicController.init= function(app){
        
        app.get("/music/:station?",function(req,res){
       
       //music.getStationList({genere:req.params.genere || 'hindi'},function(err,stations){
    
        res.render("music/index2",{title:title,"user":req.user,"html":"",station:req.params.station});
    
//});
     
           
            
            
       });
       
        app.get("/music/api/stations/:genere?",function(req,res){
       
            music.getStationList({genere:req.params.genere || 'hindi'},function(err,stations){
            console.log(stations);
            res.send(stations);
    
});
     
           
            
            
       });
        
        app.get("/api/dogriRadio/CurrentSong/",function(req,res,next){
        
        radio.getDogriRadioStats(function(data){res.send(data);},function(err){
        
       next(err);
       
        
        
        });  
            
         });

    };
    
    
   
    
})(module.exports);