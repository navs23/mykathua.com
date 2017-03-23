(function(scraper){
    var crawler = require('crawler');
    var googl = require('goo.gl');
    var util = require('util');
   
    scraper.crawl4news=function(db,item,cb){
     googl.setKey(process.env.GOOGLE_API_KEY);
    var newsItem;
    var news=[];
    var c = new crawler();
    
    c.queue([{
    uri: item.getUrl(),
    
    jQuery: 'cheerio',
 
  options: {
        normalizeWhitespace: true,
        xmlMode: false
    },
    // The global callback won't be called 
    callback: function (error, res, done) {
        if(error){
            
            console.log(error);
        }else{
            
            var $ = res.$;
           
            
          
             $(item.newsWrapperSelector).each(function(i,e){
                    
                   
                    var element=$(this);
                  
                    newsItem={};
                    newsItem.group = item.getNewsGroup();
                    newsItem.newsSource=item.getSource(element);
                    newsItem.newsSource2=item.getSource2(element);
                    newsItem.news=item.getTitle(element);
                    newsItem.link=item.getLink(element);
                    newsItem.detail=item.getDetail(element);
                    newsItem.thumbnail=item.getThumbnailImg(element);
                    newsItem.newsUpdateTimeStamp=item.getUpdateTimeStamp(element);
                   
                    googl.shorten(newsItem.link).then(function (shortUrl) {
                    newsItem.link=shortUrl;}).catch(function (err) {console.error(err.message);});
                    
                    newsItem.sortOrder=item.sortOrder;
                    if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
                    newsItem.thumbnail=item.defaultImg;
                   
                    news.push(newsItem);
                    
                   
        
    });
            
           cb(null,news);
            
            done();
        }
      
      
      
    }
    
}]);
    
     }
     
    scraper.crawl4music=function(item,cb){
   
    var c = new crawler();
    
    c.queue([{
    uri: item.getUrl(),
    
    jQuery: 'cheerio',
 
  options: {
        normalizeWhitespace: true,
        xmlMode: false
    },
    // The global callback won't be called 
    callback: function (error, res, done) {
        if(error){
            
            console.log(error);
        }else{
            
            var $ = res.$;
            var song={};
            song.title=item.getTitle($);
            song.listener=item.getCurrentListener($);
            cb(null,song);
            done();
        }
      
      
      
    }
    
}]);
    
     } 
     
    scraper.crawl4jobs=function(db,item,cb){
        
     googl.setKey(process.env.GOOGLE_API_KEY);
    var jobItem;
    var jobs=[];
    var c = new crawler();
    console.log(item.getUrl());
    c.queue([{
    uri: item.getUrl(),
    
    jQuery: 'cheerio',
 
  options: {
        normalizeWhitespace: true,
        xmlMode: false
    },
    // The global callback won't be called 
    callback: function (error, res, done) {
        if(error){
            
            console.log(error);
        }else{
            
            var $ = res.$;
           
            $(item.jobsWrapperSelector).each(function(i,e){
                //console.log(i);
                    var element=$(this);
                     
                    jobItem={};
                    jobItem.img = item.getThumbnailImg(element);
                    
                    jobItem.link=item.getLink(element);
                    jobItem.position = item.getJobTitle(element);
                    jobItem.jobText = item.getJobDetail(element);
                    jobItem.postDate = item.getUpdateTimeStamp(element);
                    jobItem.id = util.format('P%s-jb%s',item.getPageIndex(),i++);
                    jobItem.origlink =jobItem.link;
                   
                   
                   
                    jobs.push(jobItem);
                    
                   
        
    });
            
           cb(null,jobs);
            
            done();
        }
      
      
      
    }
    
}]);
    
     }
     
    scraper.getNewsFullText=function(item,cb){
   
    var c = new crawler();
    
    c.queue([{
    uri: item.getUrl(),
    
    jQuery: 'cheerio',
 
  options: {
        normalizeWhitespace: true,
        xmlMode: false
    },
    // The global callback won't be called 
    callback: function (error, res, done) {
        if(error){
            
            console.log(error);
        }else{
            
            var $ = res.$;
            var news={};
            news.fullText=item.getfullNewsText($);
            
            cb(null,news);
            done();
        }
      
      
      
    }
    
}]);
    
     } 
     
    // crypto currency
    
    scraper.getHttpResponse = function(item,cb){
        
         var c = new crawler();
    
    c.queue([{
    uri: item.uri,
    
    jQuery: 'cheerio',
 
  options: {
        normalizeWhitespace: true,
        xmlMode: false
    },
    // The global callback won't be called 
    callback: function (error, res, done) {
        if(error){
            
            console.log(error);
        }else{
            
            
            
            cb(null,res);
            done();
        }
      
      
      
    }
    
}]);
        
    }
    
    scraper.crawl4RadioStations=function(item,cb){
    console.log(item.getUrl());
    var station;
    var stations=[];
    var c = new crawler({
        maxConnections : 10,
        jQuery: 'cheerio',
    // This will be called for each crawled page 
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
             $(item.selector).each(function(i,e){
                    
                   
                    var element=$(this);
                    station={};
                    station.genere=item.genere;
                    station.title = item.getName(element);
                    station.currentSong=item.getCurrentSong(element);
                    station.listerCount=item.getListenerCount(element);
                    station.mp3=item.getSource(element);
                    if (station.title !='Vybez Station')
                    stations.push(station);
                   
                   
        
    });
        }
        done();
    }
});
c.queue([item.getUrl()]);
    /*
    c.queue([{
    uri: item.getUrl(),
    
    jQuery: 'cheerio',
 
  options: {
        normalizeWhitespace: true,
        xmlMode: false
    },
    // The global callback won't be called 
    callback: function (error, res, done) {
        if(error){
            
            console.log(error);
        }else{
            
            var $ = res.$;
           
            
         
             $(item.selector).each(function(i,e){
                    
                   
                    var element=$(this);
                    station={};
                    station.genere=item.genere;
                    station.title = item.getName(element);
                    station.currentSong=item.getCurrentSong(element);
                    station.listerCount=item.getListenerCount(element);
                    station.mp3=item.getSource(element);
                    if (station.title !='Vybez Station')
                    stations.push(station);
                    //console.log(station);
                     //cb(null,station);
                   
        
    });
        setTimeout(function(){
              cb(null,stations);
            done();
            
        },2*1000);
      
            
        }
      
      
      
    }
    
}]);
    */
     } 
    
    scraper.getIPDetails=function(item,cb){
        
        //Geolocation Information
        var c = new crawler();
    var url = 'http://whatismyipaddress.com/ip/'+ item.ip;
    console.log(url);
    c.queue([{
    uri: url,
    
    jQuery: 'cheerio',
 
  options: {
        normalizeWhitespace: true,
        xmlMode: false
    },
    // The global callback won't be called 
    callback: function (error, res, done) {
        if(error){
            
            console.log(error);
        }else{
            
            var $ = res.$;
            //console.log($);
            var location={};
            location=item.getIpLocation($);
           // location.url = url;
            
            
            cb(null,location);
            done();
        }
      
      
      
    }
    
}]);
        
    } 
     
     
})(module.exports);