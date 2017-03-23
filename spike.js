var Promise = require('promise');
function getStationList(urls,cb){
 //urls =['https://www.internet-radio.com/stations/bollywood/','https://www.internet-radio.com/stations/hindi/'];
var Crawler = require("crawler");

var stations=[];
var icount=0;
var itemp=0;
var item=   {
           
        getGenre:function(e){return 'hindi'},
        selector:'table.table tr'
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
        
};

var c = new Crawler({
        maxConnections : 10,
        jQuery: 'cheerio',
    // This will be called for each crawled page 
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
          //  item ++;
            var $ = res.$;
             $(item.selector).each(function(i,e){
                    
                   
                    var element=$(this);
                    var station={};
                    station.Id = icount++;
                    station.genere=item.getGenre(element);
                    station.title = item.getName(element);
                    station.currentSong=item.getCurrentSong(element);
                    station.listerCount=item.getListenerCount(element);
                    station.mp3=item.getSource(element);
                    if (station.title !='Vybez Station')
                    //console.log(station);
                    stations.push(station);
                   
    });
        }
        done();
        
       // if (itemp==urls.length)
        //completed(itemp);
    }
});
//console.log(urls);

//c.queue(urls);

    
    for(var i in urls)
{
    
    c.queue(urls[i]);    
    
}


 setTimeout(function(){
     
        cb(stations);
    },5*1000);
    
};

var urls =['https://www.internet-radio.com/stations/bollywood/','https://www.internet-radio.com/stations/hindi/','https://www.internet-radio.com/stations/rock/','https://www.internet-radio.com/stations/80s/'];
/*
getStationList(urls,function(result){
    console.log("%d stations found",result.length);
    
});
*/
var moment = require('moment');
console.log(moment().format('MMMM Do YYYY h:mm:ss a'));