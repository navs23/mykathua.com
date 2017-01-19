
//process.env.GOOGLE_API_KEY
var Datastore = require('nedb')
var dbNews = new Datastore({ filename:  'news.db',autoload:true});

    for (var i=0;i<50;i++)
    {
        dbNews.remove({},function(err,doc){});
    dbNews.insert({id:i,name:'naveen'}, function (err, newDoc) {
                     
                     dbNews.count({},function(err,count){
                         
                         console.log(count);
                     });
                    
                });
}

dbNews.persistence.compactDatafile();

