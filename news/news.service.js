(function(newsService){

    require('colors');
    const scraper = require('../news-scraper');
    newsService.buildAndSave=function(){
        
        scraper.getNews().then(articles=>{
            
            let NewsModel = require('../database/models/newsModel');
            let db = require('../database');
            db.deleteAndSave(NewsModel,articles)
              .then(result=>console.log(result.length))
              .catch(err=>console.log(err));
        })
        .catch(err=>{console.log(err.red)
        });
    }
    // newsService.getNews=function(){
    //   let db = require('../database');
    //   let NewsModel = require('../database/models/newsModel');
      
    //   db.get(NewsModel,{})
    //   .then(articles=>console.log(articles))
    //   .catch(err=>console.log(err));
    // }
}(module.exports))
