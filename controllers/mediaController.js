/*
node-cache module added
*/
(function(mediaController){
    
    var cheerio = require('cheerio');
    var data =require("../sql");
    var dex =require("../helper");
    var twt =require("../helper/tweet.js");
    var OAuth= require('oauth').OAuth;
    var async= require('async');
    var NodeCache = require('node-cache');
    //var newsItemCache;
    var newsItemCache = new NodeCache( { stdTTL: 100, checkperiod: 10 } ); 
   
   // landing page;
mediaController.init= function(app){
    /* 
     BuildNewsCache(function(err,news){
         
        newsItemCache.set( "news", news, function( err, success ){
        
            if( !err && success ){
                console.log( 'news cache build successfully' );
            }
        });    
         
     });
     
     
     newsItemCache.on( "expired", function( key, value ){
         console.log('cache has expired..');
	
});
     */
   routes(app);

   BuildNewsCache(function(err,news){
             
             console.log('cache re-created successfully');
             
         });    
      
        
}
    
    var getSportsNews=function(cb,errCb){
    
    
    var description;
    var newsLink;
    var newsImg;
    
    dex.scrape('http://news.google.co.in',function(html){
    
    //console.log(html);
    var $=cheerio.load(html);
    
    
    $('table.media-strip-table').each(function(i,e){
       console.log($(e).html());
        
        
    });
    
    
    
    
    var html2='<table cellspacing="0" cellpadding="0" class="main-content-with-gutter main-am2-pane rt-present">'+ $('#main-pane > div > div > div.content-pane-container > div > div.main-content-with-gutter-wrapper > table').html() +'</table>';
    
    cb(html2);
    
    });
      
    };    
       
    var getGoogleNews=function(cb){
    
    var news=[];
    var newsItem={};
    var description,newsLink,newsImg;
  //  try
//    {
    dex.scrape('http://news.google.co.in',function(html){
    var $=cheerio.load(html);
    
     $('div.esc-body').each(function(i,e){
         
        //console.log($(e).html());
        var temp=$(this).find('span[class=titletext]');
        var tempimg=$(this).find('img');
        
        
        newsItem={};
        newsItem.link=temp.parent().attr('href');
        newsItem.news=$(temp).text();
        newsItem.description=$(this).find('div[class=esc-lead-snippet-wrapper]').text();
        newsItem.thumbnail=tempimg.attr('imgsrc');
        
        if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
            //newsItem.thumbnail=tempimg.parent().attr('imgsrc');
           newsItem.thumbnail= $(this).find('img[class=esc-thumbnail-image]').attr('src');
        
        if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
            newsItem.thumbnail='http://placehold.it/25/ffcc66?text=google-news';
        
       // console.log(newsItem); 
        news.push(newsItem);
        
      
         
     });
    
  
    });
    
    cb(null,news);
        
    
    }
    
 
    
    var getDENews=function(cb){
    
    var news=[];
    dex.scrape('http://www.dailyexcelsior.com/state/',function(html){
    //var news=[]; 
    var $=cheerio.load(html);
    
    $('div.contentheading').each(function(i,e){
       
       var newsItem={};
       var item=$(this);
       var detail=item.next('div'); 
       var description =$(detail).html();
       if (/Kathua/.test(description) || (/KATHUA/.test(description)))
      {
       
       newsItem.link=item.find('a').attr('href');
       newsItem.news=item.text();
       newsItem.description=description;
        
        if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
        {
            newsItem.thumbnail='http://placehold.it/50/6699ff?text=DE-news'
        }
       
       news.push(newsItem);
      
      }
    });
         setTimeout(function(){ cb(null,news);},1000);
          
    },function(err){cb(err,null)});
    // }
    }
    
    
    var getJagranNews=function(cb){
    
    
    var news=[];
    var iCount=0;
    var url='';
    //var siteUrl='http://www.jagran-io.com/local/jammu-and-kashmir_kathua-news-hindi';
    
    
    for(var newsCtr=0;newsCtr<4;newsCtr++)
        
        {
        
        (function(pageCtr){
            
             url='http://www.jagran.com/local/jammu-and-kashmir_kathua-news-hindi-page' + (pageCtr+1) +'.html';
            
            dex.scrape(url,function(html){
            
           // console.log(html);
            
                var $=cheerio.load(html);
                $('div.listingcol ul.listing li').each(function(i,e){
                   // console.log('value of icount is %d',iCount);
                    
                    if ( iCount<10){
                    
                        var newsItem={};
                        var dated=$(e).find('span.date-cat').text();
                        var dtArr=dated.split(':');
                        var dtCurrent= new Date();
                        var dt = new Date(dtArr[1].substring(1,dtArr[1].length-2));
                       
                     
                        if(daydiff(dt,dtCurrent)<=2)
                        {
                        
                        newsItem.news=$(e).find('a').text();
                        newsItem.link='http://www.jagran.com'+ $(e).find('a').attr('href');
                        
                        newsItem.date=$(e).find('span.date-cat').text();
                        newsItem.description= $(e).find('p').text();
                        newsItem.thumbnail=$(e).find('img').attr('src');
                        
                        if (newsItem.thumbnail == null || newsItem.thumbnail == undefined)
                        {
                        newsItem.thumbnail='http://placehold.it/50/fffff?text=Jagran'
                        }
                        
                        news.push(newsItem);
                      // console.log(JSON.stringify((newsItem)));
                        iCount++;
                        
                        
                        }
                      
                    
                    }
                   
                });
        
        },function(err){return cb(err,null);});
        
        })(newsCtr);
        
    
    }
    
     setTimeout(function() {
                        console.log('raising jagran news cb..');
                    cb(null,news); 
                    }, 2000);
    
    
    }
    
    var getAJNews=function(cb){
    var news=[];
    var url='http://www.amarujala.com/channels/city/kathua/kathua-hindi-news/';
    
    dex.scrape(url,function(html){
    
    var $=cheerio.load(html);
    
    
    $('div.div672 div.listing-page').each(function(i,e){
    
    var newsItem={};
    
    
    newsItem.news=$(e).find('h3').text();
    newsItem.link=$(e).find('a').attr('href');
    newsItem.thumbnail=$(e).find('img').attr('src');
    if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
    {
    newsItem.thumbnail='http://placehold.it/50/6699ff?text=google-Amar-Ujala'
    }
    
    newsItem.description= $(e).text();
    //console.log(newsItem);
    news.push(newsItem);
    
    });
    setTimeout(function(){ cb(null,news);},1000);
    
    
    },function(err){return cb(err,null);});
    
    }
    
    
    var jammuNews=function(cb){
    
    var news=[];
    var url='http://jammulinksnews.com/category/Jammu';
    
    dex.scrape(url,function(html){
    
    var $=cheerio.load(html);
    
    
    $('table.grey_borderbox').each(function(i,e){
    
    var newsItem={};
    
    
    newsItem.news=$(e).find('a').text();
    newsItem.link='http://jammulinksnews.com/' + $(e).find('a').attr('href');
    newsItem.thumbnail='http://jammulinksnews.com/' + $(e).find('img').attr('src');
    
    if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
    {
    newsItem.thumbnail='http://placehold.it/50/6699ff?text=google-Amar-Ujala'
    }
    
    newsItem.description= $(e).text();
    
    //console.log(newsItem);
    news.push(newsItem);
    
    });
    setTimeout(function(){
    
    
    cb(null,news);
    
    },1000);
    
    
    },function(err){cb(err,null);});
    
    
    };
    
    function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
    }
    
    
    var getNews= function(cb){
        var news={};
    try{

    getGoogleNews(function(err,gnews){
        if (err==null) news.googleNews=gnews;
    
    // daiiy excelsior news
    getDENews(function(err,deNews){
      if (err==null) news.dailyexcelsiorNews=deNews;
      
    jammuNews(function(err,jNews){
    if (err==null)news.jammuNews = jNews;
    
    // jagran news     
    
    getJagranNews(function(err,jNews){
        if (err==null) news.jagranNews=jNews; 
           
           cb(null,news);
        
    });
    
        
    });                
    
    });    
    
    
    });
    
    }catch(err){
    console.log(err);
    return cb(err,null);
    
    }
    
    };
    
    var BuildNewsCache= function(cb){
        
        getNews(function(err,newsItems){
            
                   if (err==null)  {
                       
                        newsItemCache.set( "news", newsItems, function( err, success ){
        
                                if( !err && success ){
                                       console.log( 'news cache build successfully' );}
                            
                                });    
                       
                       //newsItemCache=newsItems.news;
                       cb(null,newsItems);
                       
                   }
            
        });
        
    
    };
    
   
    newsItemCache.on( "expired", function( key, value ){
         
         console.log('cache has expired..%s',Date());
         
         BuildNewsCache(function(err,news){
             
             console.log('cache re-created successfully');
             
         });
	
    });
   
    
    var ClearNewsCache=function(){
       // newsItemCache=null;
        
    }
    var GetCacheValueByKey=function(key){
       
        var value=newsItemCache.get('news');
        return value;
              
    }
    
    var routes=function(app){

             app.get("/media/",function(req,res,next){
                /*
                 getNews(function(err,news){
                     if (err == null){
                     res.render("media/index",{user:req.user,news:news,title:"Kathua in news, get latest national, state and kathua news on mykathua.com"});
                     }
                     else
                     {
                         res.render(err);
                        return next(err);
                     }
                     
                 });
                  
                  */
                  var tempNews =GetCacheValueByKey('news');
                //console.log('value of tempNews %s',JSON.stringify(tempNews));
                
                if (tempNews == undefined  )
                {
                    console.log(1);
                   
                    BuildNewsCache(function(err,news){
                        
                        console.log('from source..');
                        
                        if (err==null){
                        res.render("media/index",{user:req.user,news:news,title:"Kathua in news, get latest national, state and kathua news on mykathua.com"});      
                        
                        }
                        else
                        res.render(err);
                        
                    });
                }   
                else
                {
                    console.log('from cache...');
                    res.render("media/index",{user:req.user,news:tempNews,title:"Kathua in news, get latest national, state and kathua news on mykathua.com"});
                }
                    
                
            });
            
            app.get("/sports/",function(req,res,next){
                
                 getSportsNews(function(html){
                  
                    html='';
                     res.render("media/sports",{user:req.user,html:html,title:"Latest sports news on www.mykathua.com"});
                     
                 },function(err){
                     
                   
                    console.log(err);
                    return next(err);
            });
            
            });
            
            
            app.get("/api/media/gnews/",function(req,res,next){
              
             getGoogleNews2(function(err,news){
                 if (err==null)
                 res.send(news);
                 else
                 {
                     return next(err);
                 }
                 
             });
            });
            
            app.get("/api/media/denews/",function(req,res){
              
                getDENews(function(deNews){
                 res.send(deNews);
                 
                
                
                });    
            });
            
            app.get("/api/media/jnews/",function(req,res){
            
            getJagranNews(function(jNews){
                
            //res.writeHead(200, {"Content-Type": "application/json"});
            //res.end(JSON.stringify(jNews));
            res.send(jNews);
            
             //res.end();
            
            });                
            });
            
            app.get("/api/media/anews/",function(req,res){
            
            getAJNews(function(aNews){
            res.send(aNews);
            //res.end();
            
            });                
                
            });
            
            app.get("/api/media/jammunews/",function(req,res){
            
            jammuNews(function(aNews){
            res.send(aNews);
            
            
            });                
                
            });
                    
            // publish local stories
            app.get("/api/stories",function(req,res){
                
            //console.log(req.url);
            var param={}
             param.storyId = req.query.storyId;
             param.showOnHomePage = req.query.showOnHomePage;
             
            var message='';
            
            if (param.storyId == undefined ) message ='invalid story Id';
            if (param.showOnHomePage == undefined ) param.showOnHomePage=0;
            
            if (message !='')
            {
               // console.log(req.query); 
                res.send(req.query);
                res.end();
                return;
            }
            data.getStories(param,
            
                    function(results){
            	            res.send(results);
            	            res.end();
            	
                },function(err){
                        console.log(err);
            	        res.render(err);
                });
                   
            });
                    
            app.get("/api/getStory/",function(req,res){
            
            //console.log(req.url);
            var param={}
            param.storyId = req.query.storyId;
            
            
            var message='';
            
            if (param.storyId == undefined ) message ='invalid story Id';
            
            
            if (message !='')
            {
            // console.log(req.query); 
            res.send(req.query);
            res.end();
            return;
            }
            data.getStory(param,
            
                function(results){
                        res.send(results);
                        res.end();
            
            },function(err){
                   // console.log(err);
                    res.render(err);
            });
               
            });
                    
            // get story comments
            app.get("/api/StoryComments/:storyId",function(req,res){
            
            var storyId = req.params.storyId;
            console.log(storyId);
            var option={};
            option.storyId = storyId;
            data.getStoryComments(option,
                    function(err,results){
                           if (err==null)
            	            res.send(results);
            	            else 
            	            res.send(err);
            	           // res.end();
            	
                });
                   
            });
                    // end story comments
                    // save comments
                    
            app.get("/api/SaveComments/:storyId/:parent/:comments",function(req,res,next){
            console.log('user is %s: tt',req.user);   
            
            if (req.user == undefined || req.user == null) {
                res.send({error:'invalid user details',errorMessage:'Please login to upload comments'});
                return;
            }
            
            var storyId = req.params.storyId;
            
            var commentData={};
            commentData.storyId =storyId;
            commentData.parent =req.params.parent;
            commentData.username =req.user.username;
            commentData.comments =req.params.comments;
            commentData.created = new Date();
            
            data.saveStoryComments(commentData,function(err,results){
                if (err == null)
                {
                    res.send(results);
                }
                else {
                    console.log(err);
                    return next(err);
                }
                
            });
            });
            
            app.get("/api/UpVoteStoryComment/:storyId/:username",function(req,res,next){
            //console.log(req.url);
            var storyId = req.params.storyId;
            
            var commentData={};
            commentData.storyId =storyId;
            
            commentData.username =req.params.username;
            
             	data.upVoteStoryComment(commentData,
                    function(results){
            	            res.send(results);
            	            //res.end();
            	
                },function(err){
                        console.log(err);
                         //res.send(err);
                         return next(err);
            	        
                });
                   
            });
            
            // get story comments
            app.get("/api/getTweets/",function(req,res,next){
                
                try{
                 
               twt.getTweets(function(data){
                   console.log(data);
                    res.send(data);
               });
                }
                catch(err){
                    
                    return next(err);
                }
                 
            });
                    
            app.get("/callback",function(req,res){
            console.log('cb from twitter');
            //res.send('call back from twitter');
            //res.end(); 
            });
        
    }

 
       
    
})(module.exports);