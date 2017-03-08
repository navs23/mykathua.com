    var geoip = require('geoip-lite');
    
    
    var ip ='::ffff:10.240.0.196'.replace('::','');
    if (ip.indexOf(':')>0)
    {
        var arr = ip.split(':');
        ip=arr[1];
    }
    var geo = geoip.lookup(ip);
    console.log(geo);