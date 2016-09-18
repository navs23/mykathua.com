(function(news){
    
    var cheerio = require('cheerio');
    var dex =require("../helper");
    
    var NodeCache = require('node-cache');
    var newsItemCache = new NodeCache( { stdTTL: 100, checkperiod: 10 } ); 
    
    var init=function(news){
        BuildNewsCache();
        console.log('intialising..');
        
    }
    
    
    news.NewItems=function(cb){
    
        GetCacheValueByKey('news',function(err,value){
               
            cb(null,value);
            
        });}
 
       
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
    var url='http://www.jammulinksnews.com/mb/news.aspx?category=Jammu';
    
    dex.scrape(url,function(html){
    
    var $=cheerio.load(html);
    
    
    $('#form1 > div:nth-child(12) > div:nth-child(1) table').each(function(i,e){
    
    var newsItem={};
    
    
    newsItem.news=$(e).find('a').text().substr(1,255);
    newsItem.link='http://jammulinksnews.com/' + $(e).find('a').attr('href');
    newsItem.thumbnail= $(e).find('img').attr('src');
    
    if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
    {
    newsItem.thumbnail='http://placehold.it/50/6699ff?text=google-Amar-Ujala'
    }
    
    newsItem.description= newsItem.news.substring(1,255);
    
    console.log(newsItem);
    news.push(newsItem);
    
    });
    setTimeout(function(){
    
    
    cb(null,news);
    
    },1000);
    
    
    },function(err){cb(err,null);});
    
    
    };
    
    var bbcNews=function(cb){
    
    var news=[];
    var url='http://www.bbc.com/hindi/india';
    
    dex.scrape(url,function(html){
    
    var $=cheerio.load(html);
    //console.log(html);
    
    $('#comp-recent-media > div > div').each(function(i,e){
    
    var newsItem={};
   // console.log('start');
    //console.log($(e).html());
   // console.log('end');
    newsItem.news=$(e).find('a').text();
    newsItem.link='http://www.bbc.com/' + $(e).find('a').attr('href');
    //newsItem.thumbnail= $(e).find('img').first().attr('src');
    //hard-news-unit__image
    
    //var $2=cheerio.load(e).html();
    //console.log($(e).find('div.js-delayed-image-load').attr('data-src'));
    //#comp-recent-media > div > div:nth-child(1) > div.eagle-item__image > div > img
    //newsItem.thumbnail=$(e).find('img').attr('src');
    newsItem.thumbnail=$(e).find('div.js-delayed-image-load').attr('data-src');
    
    // newsItem.thumbnail= $(e).find('div.hard-news-unit__image').find('img').attr('src');
    
    if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
    {
    newsItem.thumbnail='http://placehold.it/50/6699ff?text=BBC'
    }
    
    newsItem.description= $(e).text();
    

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
        else news.googleNews=[];
    
    // daiiy excelsior news
    getDENews(function(err,deNews){
      if (err==null) news.dailyexcelsiorNews=deNews;
      
    jammuNews(function(err,jNews){
        
    if (err==null)news.jammuNews = jNews; else news.jammuNews=[];
    if (news.jammuNews == null || news.jammuNews == undefined ) news.jammuNews=[];
    
    // jagran news     
    
    getJagranNews(function(err,jNews){
        if (err==null) news.jagranNews=jNews; 
           
           //cb(null,news);
        
    });
    
    bbcNews(function(err,bbcnews){
          if (err==null) news.bbcNews=bbcnews; 
           
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
                       
                        if (cb !=null || cb != undefined)  cb(null,newsItems);
                       
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
    
    var GetCacheValueByKey=function(key,cb){
       
        var value=newsItemCache.get('news');
        if (value==undefined)
        {
            
               BuildNewsCache(function(err,news){
                   value=news;
               });
        }
        cb(null,value);
        
        //console.log(value);
        return value;
              
    }
    
    init();
    
})(module.exports);