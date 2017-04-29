/*
var fh = require('./helper/filehelper.js');
fh.createFolder({'folderName':'classified'},function(err,res){
    console.log(JSON.stringify(res));
});
*/

  var jobs =require("./helper/jobs.js");
  var util = require('util');
  var searchUrl ='http://www.sarkarinaukrisarch.in/states/jobs-in-jammu-and-kashmir';
  jobs.getJobs({url:util.format("%s/page/%d",searchUrl,1)},function(err,data){
    console.log(JSON.stringify(data));
    
}); 