    "use strict";
    (function(vm){
    
    var yss = require('./youtube-simple-search'); 
    
    vm.search= function(params,cb){	yss({
		key: process.env.GOOGLE_API_KEY,
		query: params.searchStr || "kathua",
		maxResults: params.maxResults || 50,
		regionCode:"IN"
	},
		function(result){
		    cb(result);
		    	
		    
		}
	);
    
    }
        
    })(module.exports);
    