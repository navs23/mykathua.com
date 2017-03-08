(function(helper)
{
    var async = require('async');
     var scraper = require("../helper/scraper.js");
     var util = require('util');
 helper.getJobs= function jobsAggregator(options,cb)         
{
          var jobs=[];
         //
async.series(
    [
        
    function(callback) {
         var pages=[options.pageIndex];
         var ictr=0;
          pages.map(function(page){
              
           scraper.crawl4jobs( null, {
            getUrl:function(){return options.url}
            ,jobsWrapperSelector:'article'
            ,sortOrder:1
            ,getPageIndex:function(){return page}
            ,getJobGroup:function(){return 'National';}
            ,getSource:function(){return 'sarkari naukri';}
            ,getJobTitle:function(e){return e.find('h2.post-title').text();}
            ,getThumbnailImg:function(e){
            var t = e.find('img.alignleft').attr('src');
            if (t == '' || t ==undefined)
                return 'http://placehold.it/25/ffcc66?text=google-news';
            else return t;
                
            }    
            ,getLink:function(e){return e.find('a').attr('href');}
            ,getJobDetail:function(e){return e.find('div.post-content').text().trim().replace('...Read More','');}
            
            ,getUpdateTimeStamp:function(e){return e.find('i.icon-time').text().trim();}
            
            },function(err,data){
                
            if(err==null)
            {
             
              ictr++;
              console.log(ictr);
              (jobs.push(data));
              if (pages.length == ictr){
                  console.log('final');
               
                callback(err,jobs);
              }
            }
            else
            {
                console.log('error occured while getting jobs %s',err);
             
            }
            
            });
            console.log('done');
          });
          
          
          
    }
   
],
    // optional callback
    function(err, results) {
   
   
    if (err==null){
    
    
    cb(null,results);
    
    }
    else 
    cb(err,null);
    
});
 
         //
}   
}
)(module.exports);