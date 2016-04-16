(function(data){
   
var OAuth= require('oauth').OAuth;
var OAuth= require('oauth').OAuth;
oa = new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET, 
                 "1.0A", "http://localhost:808/oauth/callback", "HMAC-SHA1");


data.getKathuaTweets= function(){
    console.log({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  
});
    
    client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response){
   console.log(tweets);
});



}


}
)(module.exports)