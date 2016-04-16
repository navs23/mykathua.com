(function(helper)
{
   
   var request = require('request');
   const crypto = require('crypto');
  
   
   helper.scrape=function(url,cbsuccess,cberror){
    
    request(url, function (error, response, html) {
        
        if (!error && response.statusCode == 200) {
               cbsuccess(html);
            }
        else cberror(error);    
        });
   }
   
   
   helper.scrapePost=function(url,data,cb){
   request.post({url:url, form: data}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  //console.log('Upload successful!  Server responded with:', body);
  cb(body);
});
       
   }
   
   helper.encrypt =function (text){
  var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
helper.decrypt=function (text){
  var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
   
}


)(module.exports);