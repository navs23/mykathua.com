(function(accountController){
    
    var dal = require('../sql/accountDal.js');
    
     accountController.init= function(app,passport){
      
app.get('/login/', function(req, res,nex) {
		res.render('account/login'); // load the index.ejs file
	});
	
	/*
 app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    */
    	
 app.get('/profile', isLoggedIn, function(req, res) {
        res.render('account/profile', {
            user : JSON.stringify(req.user) // get the user out of session and pass to template
            
            
        });
    });

app.get('/api/listusers',isLoggedIn, function(req, res) {
    
      dal.listUser(function(recordset){
          res.send(recordset);
          
      },function(err){
          
          res.send(err);
      });
      
    });    

        // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // facebook routes

    app.get('/auth/facebook', passport.authenticate('facebook'));
    
     app.get('/auth/facebook/callback',passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    //passport, name, options, callback
    app.get('/auth/twitter', passport.authenticate('twitter'),function(){});

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {successRedirect : '/',failureRedirect : '/' }));

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
   // console.log('isloggedIn');
//console.log(isAuthenticated());
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login/');
}
    
})(module.exports);