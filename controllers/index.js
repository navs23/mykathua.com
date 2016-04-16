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
    controllers.init = function(app,passport){
        
      // console.log(passport);
        homeController.init(app);
       
        accountController.init(app,passport);
        classifiedController.init(app);
        galleryController.init(app);
        mediaController.init(app);
       
        messageController.init(app);
        musicController.init(app);
     otherController.init(app);
     aboutController.init(app);
         
    };
    
    
})(module.exports);