(function(news){

let newscraper = require('../helper/news-scraper');
const async =require('async');
let cheerio = require('cheerio');

news.getNationalNews=(startId)=>{
    console.log("reterving national news %s",startId);
return new Promise(function(resolve,reject){
    newscraper.scrapeNews('https://www.dailyexcelsior.com/national-news')
    .then((html)=>{
    scrapeNews(html,'div.item-details',startId).then(newsArticles=>{
       
           return resolve(newsArticles);
      
       })
     
    })
    .catch((error)=>{
       // console.log(error);
        return reject(error);
    });
});


}
news.getStateNews=(startId)=>{
    console.log("reterving state news %s",startId);
    return new Promise(function(resolve,reject){
        newscraper.scrapeNews('https://www.dailyexcelsior.com/state')
        .then((html)=>{
        scrapeNews(html,'div.td-block-span6',startId).then(newsArticles=>{
               //console.log(mockNews.stateNews);
               return resolve(newsArticles);
          
           })
         
        })
        .catch((error)=>{
           // console.log(error);
            return reject(error);
        });
    });
    
    
    }

function scrapeNews(html,selector,startId){
   // console.log(selector);
  // console.log(html);
    let $ = cheerio.load(html);
    let artcileId = startId || 1;
    let news=[];
   return new Promise(function(resolve,reject){
    async.series([
        function(callback) {
            // do some more stuff ...
          //  console.log('scrapping state news');
          //'div.item-details'
         // console.log($(selector).length);
            $(selector).each(function(i,element)  {

                let newsItem={};
                let $a =  $(this).find('a')   ;

               
                let title = $a.attr('title');
                if (title){
                newsItem.id= artcileId++;
                newsItem.title= title;
                newsItem.link=$a.attr('href');
                newsItem.imgsrc = $a.find('img').attr('src') || ''; 
                newsItem.postdate=  $(this).find('time').attr('datetime')  ;;
                newsItem.author = $(this).find('span.td-post-author-name').attr('datetime')   ;
                newsItem.abstract =  $(this).find('div.td-excerpt').text();   

               if(newsItem.abstract == "")
                newsItem.abstract = newsItem.title;

                newsItem.source= "DailyExcelsior.com"
                news.push(newsItem);
                }
            });
            callback(null, news);
        }
    ],
    // optional callback
    function(err, results) {
        if (err)
        return reject(err);
        return resolve(news)
       
    });
       
    

});
     

    

}

}(module.exports))
