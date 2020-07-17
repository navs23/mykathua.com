(function(newsService){
    const async =require('async');
    const de =  require('./de');
    const jammuLink = require('./jammuLinks');

    newsService.getNews=()=>{
       let newsItems =[];
       let startId =1; 
       let newscb = [
                
        callback=> {
           
           jammuLink.getJammuNews(startId).then(news=>{
                newsItems.jammuLink=news;
                newsItems =newsItems.concat(news);
                callback(null, news);
            })
              
            }
            ,
             callback=>{
                 de.getStateNews(newsItems.length+1).then(newsArticles=>{
                     newsItems =newsItems.concat(newsArticles);
                     callback(null,newsArticles)
                 })
              
             }
             ,
             callback=>{
                 de.getNationalNews(newsItems.length+1).then(newsArticles=>{
                     newsItems =newsItems.concat(newsArticles);
                     callback(null,newsArticles)
                 })
              
            }
    ];
        return new Promise(function(resolve,reject){
            async.series(newscb,
             //optional callback
            function(err, results) {
                if (err)
                return reject(err);
               
                return resolve(newsItems)
                
            });
});
}

}(module.exports))
