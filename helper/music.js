(function(music){
    var cheerio = require('cheerio');
    var dex =require("../helper");
    
    music.listPlayingSongs=function(cb){
    //console.log('in here');
    var songs=[];
    dex.scrape('https://www.internet-radio.com/search/?radio=Bollywood+-+Sada+Bahar+Music+Radio',function(html){
        //console.log(html);
      var $=cheerio.load(html); 
    
      
      songs.push({radio:'Bollywood Sada Bahar',title:$('body > div.container > div:nth-child(1) > div.col-md-7 > table > tbody > tr > td:nth-child(2) > b').text()});
      
      
       dex.scrape('https://www.internet-radio.com/search/?radio=Bollywood+Hits',function(html){
      
      var $=cheerio.load(html); 
    
      
      songs.push({radio:'Bollywood Hits',title:$('body > div.container > div:nth-child(1) > div.col-md-7 > table > tbody > tr:nth-child(2) > td:nth-child(2) > b').text()});
      
     
      dex.scrape('https://www.internet-radio.com/search/?radio=Hindi+Desi+Bollywood+Evergreen+Hits',function(html){
          
          var $=cheerio.load(html); 
    
      
      songs.push({radio:'Bollywood Evergreen Hits',title:$('body > div.container > div:nth-child(1) > div.col-md-7 > table > tbody > tr > td:nth-child(2) > b').text()});
       dex.scrape('http://radiohsl.com/',function(html){
          
          var $=cheerio.load(html); 
      
        //#cc_strinfo_song_theaebn
        songs.push({radio:'Radio HSL',title:$('#cc_strinfo_song_theaebn').text()});
      
      
             //console.log( 'now playing %s',JSON.stringify(songs));
      
      cb(null,songs);
       },errorCb);
          
      },errorCb);
      
      
     
    },errorCb);
      
      
      
   
        
    },errorCb);
    
    //
    function errorCb(err){
        
        console.log('error =>> %s ',err);
    }
    
    
    }
    
    }(module.exports))