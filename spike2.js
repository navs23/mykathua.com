var fh = require('./helper/filehelper.js');
fh.createFolder({'folderName':'classified'},function(err,res){
    console.log(JSON.stringify(res));
});