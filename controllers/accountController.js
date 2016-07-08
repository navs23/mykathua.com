(function(accountController){
    
    var dal = require('../sql/accountDal.js');
    var emailHelper = require('../helper/mail.js');
    var validator = require("email-validator");


     accountController.init= function(app,passport){
      
    app.get('/login/', function(req, res,nex) {
        //res.re
        
        
	res.render('account/login'); // load the index.ejs file
		//res.redirect('http://www.mykathua.com/login/');
		
		
	});
	
	app.get('/login2/', function(req, res,nex) {
        //res.re
		res.render('account/login'); // load the index.ejs file
		//res.redirect('http://www.mymathua.com/login2')
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
    app.get('/auth/twitter', passport.authenticate('twitter'),function(){
        
        console.log('twitter login..');
        
    });

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect : '/',failureRedirect : '/' }));
        

    app.post('/loginMe',passport.authenticate('local', { failureRedirect: '/loginFailure',successRedirect  : '/loginSuccess' }));
    
    app.post('/registerMe', function(req,res){
        console.log(req.body.name);
        
       if (req.body.name.length<6){
        return res.send({errorCode:100,errorMessage:'invalid name'});
       }
       console.log(1);
       if (!validator.validate(req.body.username)){
        return res.send({errorCode:101,errorMessage:'invalid email address'});
       }
       console.log(2);
       if (req.body.password1 != undefined && req.body.password1.length<6){
        return res.send({errorCode:102,errorMessage:'invalid password'});
       }
       console.log(3);
        if (req.body.password2 != undefined && req.body.password2.length<6){
        return res.send({errorCode:103,errorMessage:'invalid password'});
       }
       console.log(4);
       if (req.body.password2 != req.body.password2){
        return res.send({errorCode:104,errorMessage:'password do not match'});
       }
       
       dal.registerUser(req.body,function(err,registerUserResponse){
           
           console.log(5);
           if (err!=null)
           {
               
             emailHelper.sendEmail(
        {
            from: 'error@mykathua.com',
            to: req.body.username,
            subject: 'an error occured while registering new user',
            text: JSON.stringify(err)
        });
        
               return res.send(err);     
           }
           
            console.log(JSON.stringify(registerUserResponse));
            
       
       if (registerUserResponse[0].message ==  '')
       {
        emailHelper.sendEmail(
        {
            from: 'do-not-reply@mykathua.com',
            to: req.body.username,
            subject: 'mykathua.com->registeration, email confirmation',
            html: "<a href='" + process.env.BASE_WEBSITE_URL + registerUserResponse[0].tocken + "'>click here to confirm</a>"
        }
      );
       
        return res.send({errorCode:200,errorMessage:'awaiting user confirmation'});     
           
       }
       else 
        
      
        return res.send(registerUserResponse[0]);      
       }
      
       );
       
    });
    
    app.get('/loginFailure', function(req, res, next) {
      res.send({errorCode:100,errorMessage:'Failed to authenticate, please check your login details and try again'});
    });
    
    app.get('/loginSuccess', function(req, res, next) {
     
      res.send({errorCode:200,errorMessage:' authenticated'});
    });
    
    app.get('/account/confirm/:tocken',function(req,res){
        
        var tocken=req.params.tocken;
        
        dal.activateUser({tocken:tocken},function(err,response){
            
            if (err !=null)
            {
                console.log('%s,%s','activation response',JSON.stringify(response));    
                return res.send(response.errorMessage);
            }
            
            else
            {
                return res.send(err);
                
            }
        })
        
        
        
        
    }) ;
    
    app.get('/account/resetPasswordEmail/',function(req,res){
        res.render('account/resetPassword',{type:'request'});
        
    }) ;
    
    app.post('/account/generateResetPasswordEmail/',function(req,res){
        
       if (!validator.validate(req.body.email)){
        return res.send({errorCode:101,errorMessage:'invalid email address'});
       }
      dal.generatePasswordResetTocken(req.body,function(err,result){
          
          console.log("/account/resetPassword/" + result.tocken );
          if (err==null)
          {
             
            var message='<p>Dear ' + result.displayName + ',</p>';
            message +="<p>You reqested that your password be reset. Your old password will be active until you create a new password.</p>";
            message +="<p>Please click on the <strong>below link to complete your password reset process.</p>";
            message +="<p><a style='block:inline;background-color:green;border:2px solid green;padding:10px;text-decoration:none;font-size:1.25em' href='" + process.env.BASE_WEBSITE_URL +"/account/resetPassword/" + result.tocken + "'>Reset your password<a></p>";
            message +="<br/><br/>";
            message +="<p>Thanks</p>";
            message +="<p>Mykathua.com team</p>";
             emailHelper.sendEmail(
                {
                    from: 'donot-reply@mykathua.com',
                    to: req.body.email,
                    subject: 'password reset email',
                    html: message
            });
            return res.send({errorMessage:'Please check your email and follow the instructions to reset your password'});
          }
          else
          {
            return res.send(err,null);
          }
      });
        
       
        
        
    }) ;
    
    app.get('/account/resetPassword/:tocken',function(req,res){
        
        var tocken=req.params.tocken;
        res.render('account/resetPassword',{tocken:tocken,type:'reset'});
        
       
        
        
    }) ;
    
    app.post('/account/resetPassword',function(req,res){
        
      
      dal.updatePassword(req.body,function(err,result){
          if (err==null)
          return res.send(result);
          else
          return res.send(err);
      });
        
       
        
        
    }) ;

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