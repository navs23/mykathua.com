require('colors');
const cache = require('memory-cache');
const newsService = require('../../news/news.service')
let memCache = new cache.Cache();
// 2 hours
const expiryTime =120 * 30 * 2 * 1000;
let databaseMiddleware = () => {
    let type="news";
    return (req, res, next) => {
        console.log('qeury database for news');
        let key =  '__mykathua__' + type
        let hasBuild = memCache.get(key);
        if(hasBuild){
            console.log('already stored in database'.green);
            return next();
        }else{
            console.log('scrapping news again'.red);
            newsService.buildAndSave();
            memCache.put(key,{news:{item:key}},
                         expiryTime,(key,value)=>{
            console.log(key + 'expired')
            newsService.buildAndSave();
            return next();
        });
        next();
        }
    }
}


module.exports= databaseMiddleware
