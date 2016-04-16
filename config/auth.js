(function(config){

config = {

    'facebookAuth' : {
        'clientID'      : '1508321656143109', // your App ID
        'clientSecret'  : 'f56db546072bdb7da389e789a8c68819', // your App Secret
        'callbackURL'   : 'http://navs-navs23.c9users.io/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : process.env.TWITTER_CONSUMER_KEY,
        'consumerSecret'    : process.env.TWITTER_CONSUMER_SECRET,
       // 'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
        //'callbackURL'       : 'http://navs-navs23.c9users.io/auth/twitter/callback'
        'callbackURL'       : 'http://navs-navs23.c9users.io/auth/twitter/callback'
        
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
})(module.exports);