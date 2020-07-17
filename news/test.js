const ns = require('./news.service');
/*
ns.getNews()
.then((res)=>console.log(res))
.catch(err=>console.log(err));
*/
let db = require('../database');
let NewsModel = require('../database/models/newsModel');
db.get(NewsModel,{})
      .then(articles=>console.log(articles))
      .catch(err=>console.log(err));
