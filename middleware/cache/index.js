    require('colors');
    const cache = require('memory-cache');
    let memCache = new cache.Cache();
    let cacheMiddleware = (duration) => {
        return (req, res, next) => {
            let key =  '__express__' + req.originalUrl || req.url
            let cacheContent = memCache.get(key);
            if(cacheContent){
                console.log('serving from cache'.green);
                res.send( cacheContent );
                return
            }else{
                console.log('building cache');
                res.sendResponse = res.send;
                res.send = (body) => {
                    //console.log(body);
                    memCache.put(key,body,duration * 1000);
                    res.sendResponse(body)
                }
                next();
            }
        }
    }


module.exports= cacheMiddleware
