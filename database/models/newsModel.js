const mongoose = require('mongoose');
newSchema={
id:{type:Number},
title:{type:String},
link:{type:String},
imgsrc : {type:String}, 
postdate:  {type:String},
author : {type:String} ,
abstract :  {type:String},   
source :{type:String}
};
module.exports = mongoose.model('news',newSchema);



