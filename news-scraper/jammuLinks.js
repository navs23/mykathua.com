(function(news){

let newscraper = require('../helper/news-scraper');
const async =require('async');
let cheerio = require('cheerio');

news.getJammuNews=(startId)=>{
    console.log("reterving jammu news %s",startId);
return new Promise(function(resolve,reject){
    newscraper.scrapeNews('http://www.jammulinksnews.com/category/Jammu')
    .then((html)=>{
       
        scrapeNews(html,'#grid > div.col-sm-4',startId).then(newsArticles=>{return resolve(newsArticles); })
    })
    .catch((error)=>{
       // console.log(error);
        return reject(error);
    });
});


}

function scrapeNews(html,selector,startId){
   
    // console.log(html);
       let $ = cheerio.load(html);
       let artcileId = startId || 1;
       let news=[];
      // console.log($(selector).length);
      return new Promise(function(resolve,reject){
       async.series([
           function(callback) {
              
               $(selector).each(function(i,element)  {
              
 
                   let newsItem={};
                   let $a = $(this).find('a')   ;
                   let image = $(this).find('div.section_newspic').attr('style') || '';
                   let imageIndex = image.indexOf(':');
                  
 
                   let title = $a.attr('title') || $(this).find('a').text();
                   if (title){
                   newsItem.id= artcileId++;
                   newsItem.title= title;
                   newsItem.link=$a.attr('href');
                   newsItem.imgsrc = image.slice(imageIndex+6,image.length-2) || ''; 
                   newsItem.postdate=  $(this).find('time').attr('datetime') || new Date()  ;;
                   newsItem.author = $(this).find('span.td-post-author-name').text()   ;
                   newsItem.abstract =  title;   
   
                  if(newsItem.abstract == "")
                   newsItem.abstract = newsItem.title;
   
                   newsItem.source= "jammulinks.com"
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
