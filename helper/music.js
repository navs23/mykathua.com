(function(music){
    
    var scraper = require("../helper/scraper.js");
    var async = require('async');
   var Datastore = require('nedb')
    var musicCache = new Datastore({ filename:  'music.db',autoload:true});
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
    music.getStationList = function(item,cb){
    
    scraper.crawl4RadioStations(
    {
           
        genere:item.genere,
        getUrl:function(){return 'https://www.internet-radio.com/stations/' +item.genere + '/';}
        ,selector:'table.table tr'
        ,getName:function(e){return  e.find('h4').text();} 
        ,getListenerCount:function(e){return e.find('p').text();}
        ,getCurrentSong:function(e){return e.find('b').text();}
        ,getSource:function(e){ 

         var temp= e.find('a[title="M3U Playlist File"]').attr('href');
        temp = temp.replace('/servers/tools/playlistgenerator/?u=','').replace('live.m3u&t=.m3u',';');
        temp= temp.replace('/servers/tools/playlistgenerator/?u=','').replace('listen.pls&t=.m3u',';');
        temp= temp.replace('/servers/tools/playlistgenerator/?u=','').replace('listen.pls?sid=1&t=.m3u',';');
        return temp;
        }
        
            },
            function(err,stations){
                if (err == null)  
                {
              
                //console.log(stations);
                
                //setTimeout(function(){
                     cb(null,stations)
                    
                //},5*1000);
                 
                }
                else 
                console.log(err);
            });
            
    }

    
    }(module.exports))