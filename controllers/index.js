(function (controllers){
    
    var homeController=require("./homeController"),
     accountController = require("./accountController"),
     classifiedController = require("./classifiedController"),
     galleryController = require("./galleryController"),
     mediaController = require("./mediaController"),
     messageController = require("./messageController"),
     musicController = require("./musicController"),
     otherController = require("./otherController"),
     aboutController = require("./aboutController"),
     adminController = require("./adminController"),
     bdcController = require("./bdcController"),
     jobController = require("./jobController"),
     cryptoController = require("./cryptoController");
     
    controllers.init = function(app,passport){
        
        console.log(app.auth.isLoggedIn);
        homeController.init(app);
        adminController.init(app);
        bdcController.init(app);
        
        accountController.init(app,passport);
        classifiedController.init(app);
        galleryController.init(app);
        mediaController.init(app);
        
        messageController.init(app);
        musicController.init(app);
        otherController.init(app);
        aboutController.init(app);
        jobController.init(app);
        
        cryptoController.init(app);
         
    };
    
    // route middleware to make sure a user is logged in
    

    
})(module.exports);