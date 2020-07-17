const mongoose = require('mongoose');
const uri = "mongodb+srv://kthdb:Kathua01@cluster0-wyz7p.mongodb.net/mykathua?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
                // mongodb+srv://kthdb:Kathua01@cluster0-wyz7p.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true
//const connstr = process.env.CONNSTR_MONGODB;
const db = require('./index');
let NewsModel = require('./models/newsModel');
 db.get(NewsModel,{})
    .then(articles=>console.log(articles))
    .catch(err=>console.log(err));

