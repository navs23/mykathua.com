(function(data){
  
    var seedData = require("./seedData");
   
    
    data.getUsers = function(next){
        
      next(null,seedData.users);  
    };
    
    
})(module.exports);