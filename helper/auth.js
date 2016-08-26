
(function(auth)
{
   function isLoggedIn (req, res, next) {
    // console.log('isloggedIn');
    //console.log(isAuthenticated());
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login/');
}
 
 auth.isLoggedIn= isLoggedIn;
   
}

)(module.exports);