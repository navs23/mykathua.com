(function(news){
    var async = require('async');
    var scraper = require("../helper/scraper.js");
    var Datastore = require('nedb')
    var dbNews = new Datastore({ filename:  'news.db',autoload:true});
    dbNews.persistence.setAutocompactionInterval(2*1000);
    
    var bBuildingNews=false;
    
    var init=function(news){
        
        
        newsAggregator(dbNews,function(err,newsItems){
             if (err == null)
             console.log('news aggregation finished');
             else
             console.log(err);
             
        });
        
       
    }
    
    
    setInterval(function(){
        
       // console.log('mem used %d',process.memoryUsage().heapUsed()/1000000);
        if(bBuildingNews) {
            console.log('prior build proces is still running');
            return;}
         newsAggregator(dbNews,function(err,newsItems){
             if (err == null){
                console.log('news aggregation re-build finished');
                //console.log('mem used after %d',process.memoryUsage().heapUsed()/1000000);
                
             }
            else 
                console.log(err);
        });
      
    },5*60*1000);
   
 
  news.GetNewItemsFromSql=function(cb){
      console.log('searching...');
   
    dbNews.find({}).sort({ 'group': 1 }).exec(function (err, docs) {
    cb(err,docs);
  
    });
  
       }
 
  var saveNewsInDb=function(db,filter,data,cb){
        
         db.remove(filter, { multi: true }, function (err, numRemoved) {
                
                db.insert(data, function (err, newDoc) {
                    
                   cb(null, newDoc);
                    
                });
                 });      
    }
  
  var newsAggregator = function(db,cb){
    
       bBuildingNews=true
    
    async.series(
    [
        
    function(callback) {
          console.log('getting google news');
          
           scraper.crawl4news( dbNews, {
            getUrl:function(){return 'http://news.google.co.in';}
            ,newsWrapperSelector:'div.blended-wrapper'
            ,sortOrder:1
            ,getNewsGroup:function(){return 'National';}
            ,getSource:function(){return 'googleNews';}
            ,getSource2:function(e){return e.find('td.source-cell').text();}
            ,getTitle:function(e){return e.find('h2.esc-lead-article-title').text();}
            ,getThumbnailImg:function(e){
            
            var t = e.find('img.esc-thumbnail-image').attr('imgsrc');
            if (t == '' || t ==undefined)
                return 'http://placehold.it/25/ffcc66?text=google-news';
            else return t;
                
            }    
            ,getLink:function(e){return e.find('a.article').attr('href');}
            ,getDetail:function(e){return e.find('div.esc-lead-snippet-wrapper').text();}
            
            ,getUpdateTimeStamp:function(e){return e.find('span.al-attribution-timestamp').text();}
            
            },function(err,news){
                
            if(err==null)
            {
               saveNewsInDb(dbNews,{newsSource:'googleNews'},news,function(err,result){
                    if (err == null )
                    {
                        news =null;
                        console.log(result.length);    
                        callback(err,result);
                    }
                    else
                    {
                        console.log(err);
                        callback(err,{});
                    }
                });
            }
            else
            {
            console.log('error occured while getting google news %s',err);
             callback(err,{});
            }
            
            });
          
    }
    ,
    function(callback) {
          console.log('getting dailyexcelsior news');
            scraper.crawl4news(dbNews,  {
            getNewsGroup:function(){return 'State';}    
            ,getUrl:function(){return 'http://www.dailyexcelsior.com/state/';}
            ,newsWrapperSelector:'div.contentheading'
            ,sortOrder:2
            ,getSource:function(){return 'dailyexcelsiorNews';}
            ,getSource2:function(e){return e.find('td.source-cell').text();}
            ,getTitle:function(e){return e.find('a').text();}
            ,getThumbnailImg:function(e){
                
                var t= e.find('img.esc-thumbnail-image').text();
                if (t=='')
                return 'http://placehold.it/25/ffcc66?text=DE-News'
                else return t;
                
                
            }    
            ,getLink:function(e){return e.find('a').attr('href');}
            ,getDetail:function(e){return e.next().text();            }
            
            
            ,getUpdateTimeStamp:function(){return new Date();}
            
           
                                },function(err,news){
                 if(err==null)
            {
               saveNewsInDb(dbNews,{newsSource:'dailyexcelsiorNews'},news,function(err,result){
                    if (err == null )
                    {
                        console.log(result.length);
                        news =null;
                        callback(err,result);
                    }
                    else
                    {
                        console.log(err);
                        callback(err,{});
                    }
                });
            }
            else
            {
            console.log('error occured while getting google news %s',err);
             callback(err,{});
            }
            
            });
        
    }
     ,
    function(callback) {
          console.log('getting bbc news');
       scraper.crawl4news(dbNews,  {
           getNewsGroup:function(){return 'National';}
            ,getUrl:function(){return 'http://www.bbc.com/hindi/india';}
            ,newsWrapperSelector:'#comp-recent-media > div > div'
            ,sortOrder:1
            ,getSource:function(){return 'bbcNews';}
            ,getSource2:function(e){return 'BBC news';}
            ,getTitle:function(e){return e.find('a').text();}
            ,getDetail:function(e){return e.text(); }
            ,getThumbnailImg:function(e){
                
                var img= e.find('div.js-delayed-image-load').attr('data-src');
                if (img==undefined || img =='')
                return 'http://placehold.it/25/ffcc66?text=BBC-News';
                else return img;
                
            }    
            ,getLink:function(e){return 'http://www.bbc.com/' + e.find('a').attr('href');}
            ,getUpdateTimeStamp:function(){return new Date();}
            
    },function(err,news){
                
            if(err==null)
            {
               saveNewsInDb(dbNews,{newsSource:'bbcNews'},news,function(err,result){
                    if (err == null )
                    {
                        console.log(result.length);
                        news =null;
                        callback(err,result);
                    }
                    else
                    {
                        console.log(err);
                        callback(err,{});
                    }
                });
            }
            else
            {
            console.log('error occured while getting google news %s',err);
             callback(err,{});
            }
            
            });
    }
     ,
    function(callback) {
        
        console.log('getting jagran news');
        var pageIndex=2;
        
        scraper.crawl4news(dbNews,  {
            getNewsGroup:function(){return 'Local';}
            ,getUrl:function(){return 'http://www.jagran.com/local/jammu-and-kashmir_kathua-news-hindi-page' + (pageIndex) +'.html'}
            ,newsWrapperSelector:'div.listingcol ul.listing li'
            ,sortOrder:3
            ,getSource:function(){return 'jagranNews';}
            ,getSource2:function(e){return 'Jagran News';}
            ,getTitle:function(e){return e.find('a').text();}
            ,getDetail:function(e){return (e).find('p').text(); }
            ,getThumbnailImg:function(e){
                
                var img= e.find('img').attr('src');
                if (img==undefined || img =='')
                return 'http://placehold.it/50/fffff?text=Jagran';
                else return img;
                
            }    
            ,getLink:function(e){return 'http://www.jagran.com'+ e.find('a').attr('href');}
            ,getUpdateTimeStamp:function(e){return e.find('span.date-cat').text();}
            
 },function(err,news){
                
            if(err==null)
            {
               saveNewsInDb(dbNews,{newsSource:'jagranNews'},news,function(err,result){
                    if (err == null )
                    {
                        news =null;
                        callback(err,result);
                    }
                    else
                    {
                        console.log(err);
                        callback(err,{});
                    }
                });
            }
            else
            {
            console.log('error occured while getting jagran news %s',err);
             callback(err,{});
            }
            
            });
    
        
    }
  ,
  function(callback) {
        
        console.log('getting kashmir Times news');
       
         scraper.crawl4news(null,  {
             getNewsGroup:function(){return 'State';}
            ,getUrl:function(){return 'http://www.kashmirtimes.com/news.aspx?q=Jammu%20Kashmir';}
            ,newsWrapperSelector:'a.newsheadline'
            ,sortOrder:2
            ,getSource:function(){return 'kashmirtimes';}
            ,getSource2:function(e){return 'Kashmir Times';}
            ,getTitle:function(e){return e.find('a').text();}
            ,getDetail:function(e){return e.text(); }
            ,getThumbnailImg:function(e){
                
                var img= e.find('img').attr('data-src');
                if (img==undefined || img =='')
                return 'http://placehold.it/25/ffcc66?text=Kashmir-News';
                else return img;
                
            }    
            ,getLink:function(e){return 'http://www.kashmirtimes.in/' + e.attr('href');}
            ,getUpdateTimeStamp:function(){return new Date();}
            
    },function(err,news){
                
            if(err==null)
            {
               saveNewsInDb(dbNews,{newsSource:'kashmirtimes'},news,function(err,result){
                    if (err == null )
                    {
                        news =null;
                        callback(err,result);
                    }
                    else
                    {
                        console.log(err);
                        callback(err,{});
                    }
                });
            }
            else
            {
            console.log('error occured while getting kashmirtimes news %s',err);
             callback(err,{});
            }
            
            });
    
        
    }
  ,
    function(callback) {
          console.log('getting jammu Links news');
       scraper.crawl4news(dbNews,  {
           getNewsGroup:function(){return 'State';}
            ,getUrl:function(){return 'http://www.jammulinksnews.com/category/Jammu';}
            ,newsWrapperSelector:'div.col-sm-4'
            ,sortOrder:2
            ,getSource:function(){return 'jammulinksNews';}
            ,getSource2:function(e){return 'Jammu Links';}
            ,getTitle:function(e){return e.find('a').text();}
            ,getDetail:function(e){return e.text(); }
            ,getThumbnailImg:function(e){
                
                var img= e.find('img').attr('data-src');
                if (img==undefined || img =='')
                return 'http://placehold.it/25/ffcc66?text=JammuLinks-News';
                else return img;
                
            }    
            ,getLink:function(e){return  e.find('a').attr('href');}
            ,getUpdateTimeStamp:function(){return new Date();}
            
    },function(err,news){
                
            if(err==null)
            {
               saveNewsInDb(dbNews,{newsSource:'jammulinksNews'},news,function(err,result){
                    if (err == null )
                    {
                        
                        news =null;
                        callback(err,result);
                    }
                    else
                    {
                        console.log(err);
                        callback(err,{});
                    }
                });
            }
            else
            {
            console.log('error occured while getting jammu links news %s',err);
             callback(err,{});
            }
            
            });
    }
],
    // optional callback
    function(err, results) {
    console.log('here');    
    bBuildingNews=false;
    if (err==null){
    
    
    cb(null,results);
    
    }
    else 
    cb(err,null);
    
});
 
        
    }
  
  init();
    
    
})(module.exports);
