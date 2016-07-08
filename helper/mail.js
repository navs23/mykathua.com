(function(mail){

var api_key = 'key-27291e88b8bbdabaa874f9ec7650bf2d';
var domain = 'mg.mykathua.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

mail.sendEmail=function(data){

 
mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
}
}
(module.exports))