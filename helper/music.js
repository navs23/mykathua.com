(function(music){
    
    var scraper = require("../helper/scraper.js");
    var async = require('async');
   
    music.listPlayingSongs=function(cb){
       var songs=[];
       var urls=[{
           getRadio:function(){return 'Bollywood Sada Bahar';}
           ,getUrl:function(){return 'https://www.internet-radio.com/search/?radio=Sada+Bahar+Music+Radio';}
           ,getTitle:function(e){return e('h4.text-danger').next().next().html();}
           ,getCurrentListener:function(e){return e('.table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4)').text();}
         
       }
       ,{
           getRadio:function(){return 'Hits of Bollywood';}
           ,getUrl:function(){return 'http://www.internet-radio.com/search/?radio=Hits+Of+Bollywood';}
            ,getTitle:function(e){return e('h4.text-danger').next().next().html();}   
            ,getCurrentListener:function(e){return e('.table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4)').text();}
               
           
       }
       ,{
           getRadio:function(){return 'JK City FM';}
           ,getUrl:function(){return 'http://www.internet-radio.com/search/?radio=JKCity+FM+from+Srinagar';}
            ,getTitle:function(e){return e('h4.text-danger').next().next().html();}   
            ,getCurrentListener:function(e){return e('.table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4)').text();}
               
           
       }
        ,{
           getRadio:function(){return 'Hindi Evergreen Hits';}
           ,getUrl:function(){return 'http://streema.com/radios/Hindi_Desi_Bollywood_Evergreen_Hits';}
            ,getTitle:function(e){return e('div.item:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p').text();}   
            ,getCurrentListener:function(e){return e('span.label').text();}
               
           
       }
       //http://streema.com/radios/Hindi_Desi_Bollywood_Evergreen_Hits
       ];
       async.each(urls ,function(url,callback)
       {
       
        scraper.crawl4music({
           
            getUrl:function(){return url.getUrl();}
            ,getTitle:function(e){return url.getTitle(e);}
          ,getCurrentListener:function(e){return url.getCurrentListener(e);}
            },function(err,song){
                if (err == null)  
                {
                   songs.push({radio:url.getRadio(),title:song.title,listener:song.listener});
                   callback();
                }
                else 
                console.log(err);
            });
       
      
      
        
    },function(err){
        
        if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
     cb(err,null);
    } else {
     cb(null,songs);
    }
        
    }
    );
       // cb(null,songs);
    }

    
    }(module.exports))