   var async = require('async');
   
    var googl = require('goo.gl');
    googl.setKey('AIzaSyDc2SwSwRntH9m1e21OL8btHcxl3TPwwI0');
    // var scraper = require("./helper/scraper.js");
  
  var news =require("./news/index.js");

    news.GetNewItemsFromSql(function (err,news) {
        //console.log(news);
        var t='';
        news.forEach(function(item){
            if (t=='' || t != item.group){
                console.log('*********%s',t);
            }
            
            console.log(item.group);
            t=item.group;
            
            
            
        });
        
    })        
    
    
    
