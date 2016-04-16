(function(radio){
 
    var cheerio = require('cheerio');
    var dex =require("../helper");
 
 radio.getDogriRadioStats=function(cb,cberr){
    
        //try
        //{
        var stats={};
       var apiurl='http://api.radionomy.com/currentsong.cfm?radiouid=e1b528f2-b1b7-40ca-89ed-655797333dae&apikey=b00290db-9cfa-4a3f-ac41-514f26bb5353&callmeback=yes&type=xml&cover=yes&previous=yes';
      try{
        dex.scrape(apiurl,function(data){
        
       var $=cheerio.load(data);
        
        stats.radioname=$('*').find('radioname').text();
        stats.title=$('*').find('title').text();
        stats.rank=$('*').find('rank').text();
        stats.isradionomy=$('*').find('isradionomy').text();
        stats.radurl=$('*').find('radurl').text();
        stats.artists=$('*').find('artists').text();
        stats.starttime=$('*').find('starttime').text();
        stats.playduration=$('*').find('playduration').text();
        stats.current=$('*').find('current').text();
       
       var url2='http://api.radionomy.com/currentaudience.cfm?radiouid=e1b528f2-b1b7-40ca-89ed-655797333dae&apikey=b00290db-9cfa-4a3f-ac41-514f26bb5353&callmeback=yes&type=xml'
       
        dex.scrape(url2,function(data){
            stats.listener=data.trim();
             cb(stats);
        });
       
        
       
        //}
      

});
}catch (err){
    
    cberr(err);
}
        
    }
    
}
)(module.exports);
    
