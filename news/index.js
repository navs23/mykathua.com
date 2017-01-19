(function(news){
    
    var cheerio = require('cheerio');
    var dex =require("../helper");
    var async = require('async');
    var googl = require('goo.gl');
    var dbNews;
    var NodeCache = require('node-cache');
    //var Datastore = require('nedb')
    //var dbNews = new Datastore({ filename:  'news.db',autoload:true});
    var newsItemCache = new NodeCache( { stdTTL: 100, checkperiod: 30 } ); 
    var bBuildingNews=false;
    var init=function(news){
        
     
        googl.setKey(process.env.GOOGLE_API_KEY);
        
        GetNewsAndSaveInDB(function(err,newsItems){
             
               dbNews.remove({}, { multi: true }, function (err, numRemoved) {
                
                dbNews.insert(newsItems, function (err, newDoc) {
                     console.log('rows %s',dbNews.count({},function(err,rowcount){
                         
                       console.log('news count %s',rowcount);  
                     }));
                    
                });
                 });      
             
             
        });
        
        
    }
    
    news.setNewsdb = function(db) {
           dbNews=db;
        // body...
    }
    setInterval(function(){
        console.log('building news...');
        if(bBuildingNews) {
            console.log('prior build proces is still running');
            return;}
         GetNewsAndSaveInDB(function(err,newsItems){
             dbNews.remove({}, { multi: true }, function (err, numRemoved) { 
                    console.log(err);
                    dbNews.insert(newsItems, function (err, newDoc) {   
                        console.log(err);
                        console.log('rows %s',dbNews.length);});
                 });      
                
        });
    },5*60*1000);
    /*
    news.NewItems=function(cb){
    
        GetCacheValueByKey('news',function(err,value){
               
            cb(null,value);
            
        });}
 
 */
  news.GetNewItemsFromSql=function(cb){
      console.log('searching...');
   
  dbNews.find({}).sort({ 'sortOrder': 1 }).exec(function (err, docs) {
   cb(err,docs);
  console.log(docs);
});
        
    //});
       }
 /*
    news.NewItemsAsync=function(cb){
    getNewsAsync(function(err,res){
        
       cb(err,res)
        
    });
 };
      */ 
    var getGoogleNews=function(cb){
    
    var news=[];
    var newsItem={};
    
    dex.scrape('http://news.google.co.in',function(html){
    var $=cheerio.load(html);
    
    
     $('div.esc-body').each(function(i,e){
         
        //console.log($(e).html());
        var temp=$(this).find('span[class=titletext]');
        var tempimg=$(this).find('img');
        
        
        newsItem={};
        newsItem.newsSource='googleNews';
        newsItem.link=temp.parent().attr('href');
         googl.shorten(temp.parent().attr('href')).then(function (shortUrl) {
                        newsItem.link=shortUrl;}).catch(function (err) {
                            console.log(err.message);});
        newsItem.news=$(temp).text();
        newsItem.description=$(this).find('div[class=esc-lead-snippet-wrapper]').text();
        newsItem.thumbnail=tempimg.attr('imgsrc');
        newsItem.sortOrder=1;
        if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
            //newsItem.thumbnail=tempimg.parent().attr('imgsrc');
           newsItem.thumbnail= $(this).find('img[class=esc-thumbnail-image]').attr('src');
        
        if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
            newsItem.thumbnail='http://placehold.it/25/ffcc66?text=google-news';
        
       // console.log(newsItem); 
        news.push(newsItem);
        
      
         
     });
    
  
    });
    
    setTimeout(function(){
        
        cb(null,news);
        
    },10*1000);
    
        
    
    }
    
    var bbcNews=function(cb){
    
    var news=[];
    var url='http://www.bbc.com/hindi/india';
    
    dex.scrape(url,function(html){
    
    var $=cheerio.load(html);
    //console.log(html);
    
    $('#comp-recent-media > div > div').each(function(i,e){
    
    var newsItem={};
     newsItem.newsSource='bbcNews';
   
    newsItem.news=$(e).find('a').text();
    newsItem.link='http://www.bbc.com/' + $(e).find('a').attr('href');
     googl.shorten(newsItem.link).then(function (shortUrl) {
                        newsItem.link=shortUrl;}).catch(function (err) {console.error(err.message);});
   
    newsItem.thumbnail=$(e).find('div.js-delayed-image-load').attr('data-src');
    
    // newsItem.thumbnail= $(e).find('div.hard-news-unit__image').find('img').attr('src');
    
    if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
    {
    newsItem.thumbnail='http://placehold.it/50/6699ff?text=BBC'
    }
    
    newsItem.description= $(e).text();
    //console.log(newsItem);
    newsItem.sortOrder=2;
    news.push(newsItem);
    
    });
    setTimeout(function(){
    
    
    cb(null,news);
    
    },30*1000);
    
    
    },function(err){cb(err,null);});
    
    
    };
    
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
                         newsItem.newsSource='jagranNews';
                        var dated=$(e).find('span.date-cat').text();
                        var dtArr=dated.split(':');
                        var dtCurrent= new Date();
                        var dt = new Date(dtArr[1].substring(0,dtArr[1].length-2));
                       
                     
                        if(daydiff(dt,dtCurrent)<=2)
                        {
                        
                        newsItem.news=$(e).find('a').text();
                        newsItem.link='http://www.jagran.com'+ $(e).find('a').attr('href');
                        
                        googl.shorten(newsItem.link).then(function (shortUrl) {
                        newsItem.link=shortUrl;}).catch(function (err) {console.error(err.message);});
                        
                        newsItem.date=$(e).find('span.date-cat').text();
                        newsItem.description= $(e).find('p').text();
                        newsItem.thumbnail=$(e).find('img').attr('src');
                        
                        if (newsItem.thumbnail == null || newsItem.thumbnail == undefined)
                        {
                        newsItem.thumbnail='http://placehold.it/50/fffff?text=Jagran'
                        }
                        newsItem.sortOrder=4;
                        news.push(newsItem);
                       
                        iCount++;
                        
                        
                        }
                      
                    
                    }
                   
                });
        
        },function(err){
            
            
            return cb(err,null);});
        
        })(newsCtr);
        
    
    }
    
     setTimeout(function(){
         
         cb(null,news);
         
     },30*1000);
    
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
    
     googl.shorten(newsItem.link).then(function (shortUrl) {
                        newsItem.link=shortUrl;}).catch(function (err) {console.error(err.message);});
    newsItem.thumbnail=$(e).find('img').attr('src');
    if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
    {
    newsItem.thumbnail='http://placehold.it/50/6699ff?text=google-Amar-Ujala'
    }
    
    newsItem.description= $(e).text();
       newsItem.sortOrder=6;
    //console.log(newsItem);
    news.push(newsItem);
    
    });
      setTimeout(function(){ return cb(null,news);},10*1000);
    },function(err){return cb(err,null);});
    
    
    
    }
    
    
    var jammuNews=function(cb){
    
    var news=[];
    
     
        var url='http://www.jammulinksnews.com/mb/news.aspx?category=Jammu';
        
        dex.scrape(url,function(html){
        
        var $=cheerio.load(html);
        
        
        $('#form1 > div:nth-child(12) > div:nth-child(1) table').each(function(i,e){
        
        var newsItem={};
        newsItem.newsSource='jammuNews';
        
        newsItem.news=$(e).find('a').text().substr(0,255);
        
        newsItem.link='http://jammulinksnews.com/' + $(e).find('a').attr('href');
         googl.shorten(newsItem.link).then(function (shortUrl) {
                        newsItem.link=shortUrl;}).catch(function (err) {console.error(err.message);});
        newsItem.thumbnail= $(e).find('img').attr('src');
        
        if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
        {
        newsItem.thumbnail='http://placehold.it/50/6699ff?text=google-Amar-Ujala'
        }
        
        newsItem.description= newsItem.news.substring(0,255);
        newsItem.sortOrder=3;
       //onsole.log(newsItem);
       news.push(newsItem);
       setTimeout(function(){
           
        cb(null,news);    
           
    },15*1000);
       
       
        
        });
       
    },function(err){cb(err,null);});
   
    
    };
    
    
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
       if (description=='' || description==undefined || description==null)
            description=item.next('div').next('div').text();
      //div.contentheading:nth-child(5)
       
       newsItem.link=item.find('a').attr('href');
       //description = item.find('a').text();
        googl.shorten(newsItem.link).then(function (shortUrl) {
                        newsItem.link=shortUrl;}).catch(function (err) {console.error(err.message);});
       newsItem.news=item.text();
       newsItem.description=description;
        
        if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
        {
            newsItem.thumbnail='http://placehold.it/50/6699ff?text=DE-news'
        }
          newsItem.sortOrder=5;
          
           if (/Kathua/.test(description) || (/KATHUA/.test(description)))
     
        newsItem.newsSource='dailyexcelsiorNews-kathua';
     
      else
      newsItem.newsSource='dailyexcelsiorNews-jammu';
       news.push(newsItem);
      
    });
         setTimeout(function(){ 
             cb(null,news);
             //console.log(news);
             
             
         }
             
             
             ,10*1000
             );
          
    },function(err){cb(err,null)});
    // }
    }
    
    function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
    }
    
    
    var getNews= function(cb){
        var news={};
    try{

    getGoogleNews(function(err,gnews){
        news.googleNews=(gnews || []);
       // if(err != null) console.log(gnews);
        
    
    // daiiy excelsior news
    getDENews(function(err,deNews){
      if (err!=null) console.log(err);
      news.dailyexcelsiorNews=(deNews ||[]);
      
    jammuNews(function(err,jNews){
        
    //if (err !=null) console.log(jNews);
    news.jammuNews = (jNews ||[]);
    
    
    // jagran news     
    
    getJagranNews(function(err,jNews){
        if (err !=null)
        
        news.jagranNews=(jNews ||[]);
           
           //cb(null,news);
        
    });
    
    bbcNews(function(err,bbcnews){
          if (err !=null) console.log(err);
          news.bbcNews = (bbcnews || []); 
           
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
    
    
    var GetNewsAndSaveInDB= function(cb){
     //var newsBySource={};
       bBuildingNews=true
    
    async.series([
        
    function(callback) {
          console.log('getting google news');
        getGoogleNews(function(err,news){
           
            
          //console.log(news);
            if(err==null)
            {
                //dbNews.insert(news, function (err, newDoc) {});
				callback(null,news);
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
        getDENews(function(err,news){
            
             news.newsSource='dailyexcelsiorNews';
                     
            if(err==null)
            {
              callback(null,news);
            }
            else
             {
            console.log('error occured while getting dailyexcelsior news %s',err);
             callback(err,{});
            }
            
        });
        
    }
     ,
    function(callback) {
          console.log('getting bbc news');
        bbcNews(function(err,news){
           
          
            if(err==null)
            {
                
            callback(null,news);
            }
            else
            {
            console.log('error occured while getting bbc news %s',err);
             callback(err,{});
            }
            
        });
        
    }
     ,
    function(callback) {
        console.log('getting jagran news');
        getJagranNews(function(err,news){
           
          
            if(err==null)
            {
                
            callback(null,news);
            }
            else
            {
            console.log('error occured while getting jagran news %s',err);
             callback(err,{});
            }
            
        });
        
    }
    /*,
    function(callback) {
        console.log('getting jammu news');
        jammuNews(function(err,news){
           
          
            if(err==null)
            {
                
            callback(null,news);
            }
            else
            {
                console.log(err);
             callback(err,{});
            }
            
        });
        
    }
    */
    
],
// optional callback
function(err, results) {
    bBuildingNews=false;
    if (err==null)
    
    cb(null,results);
    else 
    cb(err,null);
    
});
 
        
    }
    
    var BuildNewsCache= function(cb){
        /*
         getNewsAsync(function(err,newsItems){
             
                    //console.log(newsItems.length);
                   if (err==null)  {
                       
                        newsItemCache.set( "news", newsItems, function( err, success ){
        
                                if( !err && success ){
                                       console.log( 'news cache build successfully' );}
                                      if (cb !=null || cb != undefined)  cb(null,newsItems);
                            
                                });    
                       
                        
                       
                   }
            
        });
        
    */
    };
    
   
    newsItemCache.on( "expired", function( key, value ){
         
         console.log('cache has expired..%s',Date());
         /*
         BuildNewsCache(function(err,news){
             
             console.log('cache re-created successfully');
             
         });
	*/
    });
   
    
   
    /*
    var GetCacheValueByKey=function(key,cb){
       
      newsItemCache.get('news',function(err,value){
            
            
        if (value==undefined)
        {
            console.log('re-structing cache');
               BuildNewsCache(function(err,news){
                   console.log('in buildnewCache callback %s',news.length);
                   if (err == null){
                   cb(null,news);
                       
                   }
                   else{ 
                   
                   cb(null,[]);
                   }
               });
        }
        else
        cb(null,value);
            
            
        });
        
              
    }
    */
    init();
    
    
})(module.exports);