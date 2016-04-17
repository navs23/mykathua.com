(function(mediaController){
    
    var cheerio = require('cheerio');
    var data =require("../sql");
    var dex =require("../helper");
    var twt =require("../helper/tweet.js");
    var OAuth= require('oauth').OAuth;
    var async= require('async');
   
    
   
   // landing page;
    mediaController.init= function(app){
     
       app.get("/media/",function(req,res,next){
            
             getNews(function(news){res.render("media/index",{user:req.user,news:news,title:"Kathua in news, get latest national, state and kathua news on mykathua.com"});},function(err){
                console.log(err);
                return next(err);
       });
       
        });
        
       app.get("/media/news",function(req,res,next){
       
       getNews(function(news){
          res.send(news);
           
       },function(err){
           return next(err);
       });
        
});

app.get("/api/media/gnews/",function(req,res){
  
    getGoogleNews(
        function(news){
        res.send(news);
    
    
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
        function(results){
               // console.log(results);    
	            res.send(results);
	           // res.end();
	
    },function(err){
            console.log(err);
	        res.send(err);
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

data.saveStoryComments(commentData,function(results){res.send(results);},function(err){console.log(err);return next(err);});
       
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
    
   
var getGoogleNews=function(cb,errCb){

var news=[];
try{
dex.scrape('http://news.google.co.in',function(html){
var $=cheerio.load(html);
//var news = $('div[Id=main-wrapper]> table').html();

$('div.esc-lead-snippet-wrapper').each(function(i,e){
  if (i<=5)
  {
var description =$(this).text();
var newsLink=$(this).prev().find('a').first();

var newsImg=$(this).prev().find('img[class=esc-thumbnail-image]').first();


var newsItem={};
newsItem.link=$(newsLink).attr('href');
newsItem.news=$(this).text();
newsItem.description=description;
newsItem.thumbnail=$(newsImg).attr('src');
if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
{
    newsItem.thumbnail='http://placehold.it/25/ffcc66?text=google-news'
}
 
news.push(newsItem);
  }
  
  else
  {
        var description =$(this).html();
         if (/Jammu/.test(description) || /JAMMU/.test(description) || /kathua/.test(description) || /KATHUA/.test(description)){
            
      
        var newsLink=$(this).prev().find('a').first();
        
        var newsImg=$(this).prev().find('img[class=esc-thumbnail-image]').first();
        
        
        var newsItem={};
        newsItem.link=$(newsLink).attr('href');
        newsItem.news=$(this).text();
        newsItem.description=description;
        newsItem.thumbnail=$(newsImg).attr('src');
        if (newsItem.thumbnail ==null || newsItem.thumbnail == undefined)
        {
            newsItem.thumbnail='http://placehold.it/50/6699ff?text=google-news'
        }
        
        news.push(newsItem);
        
        }  
      
  }
  
});

cb(news);
    
},function(err){
    errCb(err);
    
});
}catch(err){

errCb(err);
}
}

var getDENews=function(cb,cberr){

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
     setTimeout(function(){ cb(news);},1000);
      
},function(err){cberr(err)});
// }
}


var getJagranNews=function(cb,cberr){

console.log('here');
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
    
    },function(err){return cberr(err);});
    
    })(newsCtr);
    

}

 setTimeout(function() {
                    console.log('raising jagran news cb..');
                cb(news); 
                }, 2000);


}

var getAJNews=function(cb,cberr){
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
setTimeout(function(){ cb(news);},1000);


},function(err){return cberr(err);});

}


var jammuNews=function(cb,cberr){

var news=[];
var url='http://jammulinksnews.com/category/Jammu';

dex.scrape(url,function(html){

var $=cheerio.load(html);


$('table.grey_borderbox').each(function(i,e){

var newsItem={};


newsItem.news=$(e).find('a').text();
newsItem.link=$(e).find('a').attr('href');
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


cb(news);

},1000);


},function(err){cberr(err);});


}

function daydiff(first, second) {
return Math.round((second-first)/(1000*60*60*24));
}

var testCb = function(cb){

//  async.series([
//    function(){
       var i=0;
       for(i=0 ; i <10000;i++){
           
           console.log(i);
          
       }
      // console.log('done.');
      cb({ctr:i});
   
 //  , function(err){
  //     if (!err)
  //     console.log('done');
      
     // res.send(i)
        
  // }
//     ],
   
//   function(err){
//    res.send('done');
   
// });

//);
}


var getNews= function(cb,cberr){
try{
var news={};
getGoogleNews(function(gnews){

news.googleNews=gnews;

// daiiy excelsior news
getDENews(function(deNews){
  news.dailyexcelsiorNews=deNews;
  
  

jammuNews(function(jNews){
news.jammuNews = jNews;

// jagran news     

getJagranNews(function(jNews){news.jagranNews=jNews; 

// getAJNews(function(aunews){
 //   news.amarujalaNews=aunews;
       
       cb(news);
    
},function(err){return cberr(err);});


   
    
//});                

    },function(err){return cberr(err);});                

},function(err){return cberr(err);});    


},function(err){return cberr(err);});
}catch(err){
console.log(err);
return cberr(err);

}

}

    
})(module.exports);