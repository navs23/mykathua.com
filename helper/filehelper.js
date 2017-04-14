(function(filehelper){
'use strict';

var kloudless = require('kloudless')('ngNZbfeeShgGq0sAWLNegiVKBCcdUIH9ulgDzpjR0ojmN6yE')
  , async = require('async')
  , fs = require('fs')
  , path = require('path');
process.env.account_id =241404742;

filehelper.upload = function(options,callback)
{


var randString = function() {return (Math.random() + 1).toString(36).substring(7);};

if (!options.fileName) 
     options.fileName = randString();
     
/*if (options.fileBuffer)
    options.fileBuffer = fs.readFileSync(options.sourceFileName);
*/
options.parent_id = options.parent_id || 'root';

var fileReName = randString();
var folderName = randString();
var folderReName = randString();
var fileId;

var linkId;
var folderId;
//console.log(JSON.stringify(options));

    console.log('uploading file please wait...');
    kloudless.files.upload({
      name: options.fileName,
      account_id: process.env.account_id,
      parent_id: options.parent_id,
      file: options.fileBuffer,
      
      queryParams: {
        overwrite: true
      }
    }, function(err, res) {
      if (err) {
        return callback(err,null);
      }
      
      //fileId = res.id;
      callback(null,res);
    });
  }

filehelper.linkFile = function(options,callback)
{
   console.log('linking file ...');
    kloudless.links.create({
      account_id: process.env.account_id,
      file_id: options.fileId
    }, function(err, res) {
      if(err) {
       return callback(err);
      }
      //linkId = res.id;
      //console.log('link create test pass');
      callback(null,res)
    });
 

}


filehelper.contents = function(options,callback) {
    console.log('files contents test...');
    kloudless.files.contents({
      account_id: process.env.account_id,
      file_id: options.fileId
    }, function(err, filestream) {
      if (err) {
        return callback(err);
      }
      var filecontents = '';
     // console.log('got the filestream:');
      filestream.on('data', function(chunk){
        //console.log('reading in data chunk...');
        //console.log(chunk);
        filecontents += chunk;
      });
      filestream.on('end',function(){
        console.log('finished reading file!');
        //if (filecontents === fileBuffer.toString()) {
          console.log('files contents test pass');
          return callback(null,filecontents);
       
      });
    });
  }
  
 filehelper.createFolder=  function(options,callback) {
    console.log('folders create test...');
    kloudless.folders.create({
      account_id: process.env.account_id,
      name: options.folderName,
      parent_id: 'root'
    }, function(err, res) {
      if (err) {
        return callback('Folders create: ' + err);
      }
      
      console.log('folders create test pass');
      callback(null,res);
    });
  }
  
}
(module.exports))