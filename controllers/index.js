(function (controllers){
    var homeController=require("./homeController");
    var accountController = require("./accountController");
    var classifiedController = require("./classifiedController");
    var galleryController = require("./galleryController");
    var mediaController = require("./mediaController");
    var messageController = require("./messageController");
     var musicController = require("./musicController");
    var otherController = require("./otherController");
    var aboutController = require("./aboutController");
    var adminController = require("./adminController");
    var bdcController = require("./bdcController");
    
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
         
    };
    
    // route middleware to make sure a user is logged in
    

    
})(module.exports);