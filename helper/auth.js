
(function(auth)
{
   function isLoggedIn (req, res, next) {
       console.log('authenticating user..');
       
     console.log(req.url);
    //console.log(isAuthenticated());
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    console.log('/login?url=' + req.url);
    req.session.redirectUrl = req.url;
    
    res.redirect('/login');
    
}
 
 auth.isLoggedIn= isLoggedIn;
   
}

)(module.exports);