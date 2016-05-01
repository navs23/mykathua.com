var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var dal = require("../sql/accountDal.js");
// load up the user model
//var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {
    //process.stdout.write('\033c');
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        //console.log(user);
        done(null, user);
    });

    // used to deserialize the user
    
    passport.deserializeUser(function(id, done) {
        //User.findById(id, function(err, user) {
        //var user={};
       // user.id=id;
            //done(err, user);
            done(null,id);
        //});
    });
    
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : 'yBuiGvDaFlNeXdoMjaJAdjvl2',
        consumerSecret  : 'rKD8ZiJ10g5qwHnVrLghnVtDkoRb5q977FTt3N1fn1HYrOaIkY',
       // callbackURL     : 'http://navs-navs23.c9users.io/auth/twitter/callback'
        callbackURL     : '/auth/twitter/callback'

    },
    function(token, tokenSecret, profile, done) {

        // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {

            /*User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {*/
                    // if there is no user, create them
                    //var newUser   = new User();
                    var newUser   = {};
                    // set all of the user data that we need
                    newUser.id          = profile.id;
                    newUser.token       = token;
                    newUser.username    = profile.username;
                    newUser.displayName = profile.displayName;
                    newUser.profile_image_url=profile.photos[0].value;
                    
                    console.log("logged in succesffully to twitter - %s ",JSON.stringify(newUser));
                     dal.saveUser(newUser,function(user){console.log("%s twiiter user saved successfully",user);},function(err){console.log (err);});
                    
                        return done(null, newUser);
                    });
            //}
            //});

    //});

    }));
    
     passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : '1508327992809142',
        clientSecret    : 'bb939e0489c4caca9167bfc508f77c5b',
        callbackURL     : '/auth/facebook/callback'
        

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            //User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
               // if (err)
                //    return done(err);

                // if the user is found, then log them in
               // if (user) {
                //    return done(null, user); // user found, return that user
               // } else {
                    // if there is no user found with that facebook id, create them
                    var newUser= {};
                    console.log(profile);
                    // set all of the facebook information in our user model
                        newUser.id    = profile.id; // set the users facebook id                   
                        newUser.token = token; // we will save the token that facebook provides to the user                    
                        newUser.username  = profile.username; // look at the passport user profile to see how names are returned
                        newUser.displayName  = profile.displayName;
                        newUser.profile_image_url=profile.profileUrl;
                        
                    if (newUser.username == undefined) newUser.username="fb-" + newUser.id;   
                        
                    console.log("logged in succesffully using facebook - %s ",JSON.stringify(newUser));
                     dal.saveUser(newUser,function(user){console.log("%s facebook user saved successfully",user);},function(err){console.log (err);});
                    
                        return done(null, newUser);
                    //});
                    //newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    //newUser.save(function(err) {
                    //    if (err)
                        //    throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    //});
               // }

            //});
        });

    }));

};