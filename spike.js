   var async = require('async');
   
    var googl = require('goo.gl');
    googl.setKey('AIzaSyDc2SwSwRntH9m1e21OL8btHcxl3TPwwI0');
     var scraper = require("./helper/scraper.js");
  

  scraper.crawl4news(null,  {
            getUrl:function(){return 'http://www.kashmirtimes.com/news.aspx?q=Jammu%20Kashmir';}
            ,newsWrapperSelector:'a.newsheadline'
            ,sortOrder:5
            ,getSource:function(){return 'Kashmir-Times';}
            ,getSource2:function(e){return 'Jammu Links';}
            ,getTitle:function(e){return e.find('a').text();}
            ,getDetail:function(e){return e.text(); }
            ,getThumbnailImg:function(e){
                
                var img= e.find('img').attr('data-src');
                if (img==undefined || img =='')
                return 'http://placehold.it/25/ffcc66?text=Kashmir-News';
                else return img;
                
            }    
            ,getLink:function(e){return 'http://www.kashmirtimes.in/' + e.find('a').attr('href');}
            ,getUpdateTimeStamp:function(){return new Date();}
            
    },function(err,news){
                
            if(err==null)
            {
               
                        console.log(news);    
                    
            }
            else
            {
            console.log('error occured while getting jammu links news %s',err);
            
            }
            
            });
            
    
