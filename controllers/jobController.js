/*
node-cache module added
*/
"use strict";
(function(jobController){
    
   
    var jobs =require("../helper/jobs.js");
    
    var cheerio = require('cheerio');
    var dex =require("../helper");
    var async = require("async");
    var util = require("util");

    //var newsItemCache;
    
   
   // landing page;
    jobController.init= function(app){
    
    routes(app);
    
    
    }
    
   
 var routes=function(app){
/*
     app.get("/jobs/jk/",function(req,res){
    
    var url='http://www.sarkarinaukrisarch.in/states/jobs-in-jammu-and-kashmir';
    renderJob(url,req,res);
    
    
    
    });
  */  
    app.get("/job/details",function(req,res,next){
    var link = req.query.target;
    console.log('getting job details %s',link);
    var data = {};
    data.link = link;
    //var url = dex.decrypt(link);
    console.log('job details link is %s',link);
    
    jobdetails(data.link,function(html){
     res.send(html); 
     
    },function(err){
      res.send(err);
    });
    
    });
    
    app.get("/jobs/jk/:pageIndex?",function(req,res){
    var url='http://www.sarkarinaukrisarch.in/states/jobs-in-jammu-and-kashmir';
    renderJob(url,req,res);
    
    });
    /*
    app.get("/jobs/",function(req,res){
    var url='http://www.sarkarinaukrisarch.in';
     renderJob(url,req,res);
    
    });
    */
   
    
    app.get("/jobs/:pageIndex?",function(req,res){
    var url='http://www.sarkarinaukrisarch.in';
    console.log('ur %s and page is %s',req.url,req.params.pageIndex);
    renderJob(url,req,res);
    
    });
    }

 var renderJob=function(searchUrl,req,res){
  
  
  var pageIndex =1;
  if (req.params.pageIndex !=undefined || req.params.pageIndex !=null) pageIndex=req.params.pageIndex;
  var pagination={};
  if (pageIndex==1)
   pagination.previousPageIndex=1;
   else
    pagination.previousPageIndex=pageIndex-1;
    
  pagination.nextPageIndex = parseInt(pageIndex) +1;
  
  //console.log('%d,%d',pagination.nextPageIndex,pagination.previousPageIndex);
  
   var url=searchUrl +'/page/' + pageIndex +'/';
   console.log(url);
   
 
 jobs.getJobs({url:util.format("%s/page/%d",searchUrl,pageIndex)},function(err,data){
    res.render('other/jobs',{data:data[0][0],recordCount:data[0][0].length,user:req.user,pagination:pagination});
   
   // console.log(data);
    
}); 
}


 var jobsearch = function(url,cb){
 
  
  var jobItem={};
  var joblist=[];
  
   //console.log(url);
   dex.scrape(url,function(html){
   
     async.waterfall([function(next){
      //console.log(1);
      next(2);
     
     },function(val,next){
      val++;
      next (val,next);
      console.log(val);
      
      
     }],function(){console.log(3);});
     
       var $=cheerio.load(html);
       $('div[id=post-entry]').find('article').each(function(i,e){
        
        jobItem={};
        jobItem.img = $(e).find('img').attr('src');
        
        jobItem.link=$(e).find('div.post-thumb a').attr('href');
        jobItem.position = $(e).find('div.post-thumb a').attr('title');
        jobItem.jobText = $(e).find('div.post-content').text().trim().replace('...Read More','');
        jobItem.postDate = $(e).find('i.icon-time').text().trim();
        jobItem.id ="jb" + i;
        jobItem.origlink =jobItem.link;
        if (jobItem.link != undefined)
        jobItem.link=dex.encrypt(jobItem.link);
       
        
         joblist.push(jobItem);
         
        
       });
       
        return cb(joblist); 
        
     
       });  
       
     }

 var jobdetails = function(url,cb,cberr){
 
var fulltext='';

 dex.scrape(url,function(html){
  
  var $= cheerio.load(html);
  
   try{
        var temp= $('div.post-content').html();
       var $2= cheerio.load(temp);
         $2('div.adsense-single').remove();
         $2=cheerio.load($2.html());
         $2('img').remove();
         //console.log($2.html());
         
         return cb($2.html());  
         
 }catch(err){cberr(err); }
 });
}
       

    
})(module.exports);