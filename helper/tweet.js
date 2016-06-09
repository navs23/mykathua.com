(function(helper)
{
   
   //var request = require('request');
   var OAuth= require('oauth').OAuth;
    
    helper.getTweets=function(cb){
        
    var obj={};
     var temp='';
    var tweet,temp_data;
    
    obj.name-'naveen sharma';
    
    var oa = new OAuth("https://twitter.com/oauth/request_token",
    "https://twitter.com/oauth/access_token", 
    process.env.TWITTER_CONSUMER_KEY,  process.env.TWITTER_CONSUMER_SECRET, 
    "1.0A", "/callback", "HMAC-SHA1");
  
   // var tweetUrl =https://api.twitter.com/1.1/statuses/home_timeline.json
   
   var tweetUrl ='https://api.twitter.com/1.1/search/tweets.json?q=mykathua OR kathua OR #kathua OR basohali OR Basoli'
   //?q=#hashtag1+OR+#hashtag2+from:username1+OR+from:username2
  // var tweetUrl ='https://api.twitter.com/1.1/statuses/retweets_of_me.json?count=50&amp;since_id=259320959964680190&amp;max_id=259320959964680500';
   
    oa.get(tweetUrl, process.env.TWITTER_ACCESS_TOKEN_KEY, process.env.TWITTER_ACCESS_TOKEN_SECRET, function(error, tweets) {
    var twtJson =JSON.parse(tweets);
    
  
    var data =twtJson;
    var tweetCount = (data.statuses==undefined?-1:data.statuses.length);
    
      for(var i=0;i<tweetCount;i++)
        {
        
            //temp ='';        
            tweet=data.statuses[i];
            temp_data = {
            user_name: tweet.user.name,
            date: dating(tweet.created_at),
            tweet: (tweet.retweeted) ? linking('RT @'+ tweet.user.screen_name +': '+ tweet.retweeted_status.text) : linking(tweet.text),
            avatar: '<img src="'+ tweet.user.profile_image_url +'" />',
            url: 'http://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
            retweeted: tweet.retweeted,
            screen_name: linking('@'+ tweet.user.screen_name)
        };
           temp +='<li class="tweet">' + templating(temp_data) + '</li>';
          
           
        }
       // console.log(temp);
        setTimeout(function(){
            
            cb(null,temp);
            
        },100);
      
    
    
  
    });
    
    
    
        
    }  
    

var templating = function (data) {
        var temp = '{{avatar}} {{user_name}}{{screen_name}}- {{date}} - {{tweet}}';
        var temp_variables = ['date', 'tweet', 'avatar', 'url', 'retweeted', 'screen_name', 'user_name'];

        for (var i = 0, len = temp_variables.length; i < len; i++) {
            temp = temp.replace(new RegExp('{{' + temp_variables[i] + '}}', 'gi'), data[temp_variables[i]]);
        }

        return temp;
    };

var linking = function (tweet) {
            var twit = tweet.replace(/(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig,'<a href="$1" target="_blank" title="Visit this link">$1</a>')
                 .replace(/#([a-zA-Z0-9_]+)/g,'<a href="http://twitter.com/search?q=%23$1&amp;src=hash" target="_blank" title="Search for #$1">#$1</a>')
                 .replace(/@([a-zA-Z0-9_]+)/g,'<a href="http://twitter.com/$1" target="_blank" title="$1 on Twitter">@$1</a>');

            return twit;
        };
        
var dating = function (twt_date) {
            // fix for IE
            var time = twt_date.split(' ');
            twt_date = new Date(Date.parse(time[1] + ' ' + time[2] + ', ' + time[5] + ' ' + time[3] + ' UTC'));

            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            var _date = {
                '%d': twt_date.getDate(),
                '%m': twt_date.getMonth()+1,
                '%b': months[twt_date.getMonth()].substr(0, 3),
                '%B': months[twt_date.getMonth()],
                '%y': String(twt_date.getFullYear()).slice(-2),
                '%Y': twt_date.getFullYear()
            };

            var date = '%b/%d/%Y';
            var format = date.match(/%[dmbByY]/g);

            for (var i = 0, len = format.length; i < len; i++) {
                date = date.replace(format[i], _date[format[i]]);
            }

            return date;
        };

  
}

)(module.exports);    