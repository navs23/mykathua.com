(function(galleryController){
    
   var 
   data =require("../sql"),
   filehelper = require("../helper/filehelper.js");
//   var multer  = require('multer')
  // var upload = multer({ dest: 'uploads/' })
   
   var fs=require('fs');
    var cheerio = require('cheerio');
    var dex =require("../helper");
    
    galleryController.init= function(app){
        
   
            
    app.get("/gallery/manage/",app.auth.isLoggedIn,function(req,res){
        
       console.log('image upload');
      
       res.render("gallery/manage",{title:"Manage images",images:null,user:req.user});
      

      
    });
    
    app.post('/gallery/upload/',app.auth.isLoggedIn, function(req, res) {
       
       console.log('user  %s',JSON.stringify(req.user));
       
       if (req.files !==null)
       {
        
        fs.readFile(req.files.file.path, function (err, data) {
            
        if (err ==null){
            
        var newPath = './uploads/' + req.files.file.name;
        
        console.log('file saved to %s,%s',newPath,JSON.stringify(req.files.file));
        
        fs.writeFile(newPath, data, function (err2) {
        
        if (err2 == null)
            {
        
            res.send("file uploaded successfully");
            
            // save image to the database
            data.saveGalleryImage({},function(err,recordset){
                
                if (err == null)
                {
                    res.send(recordset);
                    return;
                    
                }
                else
                {
                      res.send(err2);
                      return;
                    
                }
                
            });
            }
            
        else
            res.send(err2);
        });
        }
        else
        res.send(err);
        
        
        
    });
        }
    else
        res.send('No files found for uploading');
       
    
    
    
    });
 
    app.post('/gallery/uploadnew/',app.auth.isLoggedIn,function(req, res) {
       
       console.log('comments = %s path = %s',req.body.description,req.files.file.path);
       var options ={};
       //options.fileName = req.files.file.path;
       if (req.files !==null)
       {
        options.fileBuffer = fs.readFileSync(req.files.file.path);
        options.parent_id ='FnPqalfBv7JYd0aUljFxufK7t7uK0T_2andsegXZYX0Q=';
        filehelper.upload(options,function(err,result){
        if (!err)
        {
        
         
                 console.log(JSON.stringify(result))
                var param={};
                param.caption =req.body.title;
                param.image_text=req.body.description;
                param.image_path = '/showimage/' + result.id ;
                param.userName = req.user.username;
                param.category = req.body.category;
                data.saveGalleryImage(param,function(err,recordset){
                
                if (!err)
                {
                   // res.send(recordset);
                    res.render("gallery/success",{title:"Image uploaded successfully",data:result});
                  }
                else
                {
                     console.log(err);
                      res.render("gallery/success",{error:JSON.stringify(err),data:{}});
                      
                    
                }
                
            });
                    
                 
                  
               }
             else
             {
                 console.log(err);
                res.render("gallery/success",{error:JSON.stringify(err),data:{}});
             }
             
        
       
       
    
});
       
            {
        
           // res.send("file uploaded successfully");
            
            // save image to the database
            /*
            data.saveGalleryImage({},function(err,recordset){
                
                if (err == null)
                {
                    res.send(recordset);
                    return;
                    
                }
                else
                {
                      res.send(err2);
                      return;
                    
                }
                
            });
            */
          //  }
            
        //else
          //  res.send(err2);
        //});
        //}
        //else
        //res.send(err);
        
        
        
            }
           
       }
    
    
    
    });
    
    
    app.get("/api/gallery/",function(req,res){
    /*
    getImages(function(images){
      
     console.log(images);
           
      res.send(images);
      
      
    });*/
    
    data.getGalleryImages({},function(err,images){
      if (err==null){
       console.log(images);
           
      res.send(images);
      }
      else
      {
          res.send(err);
      }
      
    });
    
    });
    
    // get story comments
    app.get("/api/gallery/getComments/:galleryImageId",function(req,res){
    
    var galleryImageId = req.params.galleryImageId;
    console.log(galleryImageId);
    
    var option={};
    option.galleryImageId = galleryImageId;
    data.getGalleryImageomments(option,
            function(err,results){
                   if (err==null)
    	            res.send(results);
    	            else 
    	            res.send(err);
    	           // res.end();
    	
        });
           
    });
            // end story comments
            // save comments
            
    app.get("/api/gallery/SaveComments/:galleryImageId/:parent/:comments",function(req,res,next){
    console.log('user is %s: tt',req.user);   
    
    if (req.user == undefined || req.user == null) {
        res.send({error:'invalid user details',errorMessage:'Please login to upload comments'});
        return;
    }
    
     var galleryImageId = req.params.galleryImageId;
    
    var commentData={};
    commentData.galleryImageId =galleryImageId;
    commentData.parent =req.params.parent;
    commentData.username =req.user.username;
    commentData.comments =req.params.comments;
    commentData.created = new Date();
    
    data.saveGalleryImageComments(commentData,function(err,results){
        if (err == null)
        {
            res.send(results);
        }
        else {
            console.log(err);
            return next(err);
        }
        
    });
    });
    
    app.get("/api/gallery/UpVoteComment/:galleryImageCommentId/:username",function(req,res,next){
    //console.log(req.url);
    var galleryImageCommentId = req.params.galleryImageCommentId;
    
    var commentData={};
    commentData.galleryImageCommentId =galleryImageCommentId;
    
    commentData.username =req.params.username;
    
     	data.upVoteGalleryImageComment(commentData,
            function(results){
    	            res.send(results);
    	            //res.end();
    	
        },function(err){
                console.log(err);
                 //res.send(err);
                 return next(err);
    	        
        });
           
    });
    
     app.get("/gallery/:page?/:id?",function(req,res){
       var params={};
       params.id =req.params.id;
       params.page=req.params.page || 1;
         data.getGalleryImages(params,function(err,images){
      if (err==null){
       console.log(images);
           res.render("gallery/index2",{title:"Photo Gallery",pagination:{previousPageIndex:(parseInt(params.page) - 1),nextPageIndex:(parseInt(params.page) + 1) },images:images,defaultImageId:params.id || 1,user:req.user}); 
      //res.send(images);
      }
      else
      {
          res.send(err);
      }
      
    });
      
      
    });
    
    app.get("/showimage/:fileId?",function(req,res){
        //"F3hggj7EI8VeM0GFb3NSu0wX45111LwVobgwFD1iPOSc="
        var fileId = req.params.fileId
        console.log('file id is %s',req.params.fileId);
        if (!fileId){
            res.write ("error");
            res.end();
        }
        //|| "F3hggj7EI8VeM0GFb3NSu0wX45111LwVobgwFD1iPOSc=";
         
        
        console.log('file id is %s',fileId);
        
         filehelper.contents({fileId:fileId},function(err,img){
    
                        if (!err)
                        {
                        //console.log(img);
                         // var base64Image = (new Buffer(img)).toString('base64')
                         // console.log(base64Image);
                         res.writeHead(200, {'Content-Type': 'image/jpeg' });
                         res.end(img, 'binary');
                        }
                        else
                        console.log(err);
                                    
                 });
        
    });
    
     app.get('/showimagebinary/',function(req, res) {
         
          filehelper.contents({fileId:"F3hggj7EI8VeM0GFb3NSu0wX45111LwVobgwFD1iPOSc="},function(err,img){
    
                        if (!err)
                        {
                       
                         var base64Image = (new Buffer(img)).toString('base64')
                         // console.log(vals);
                         res.render("gallery/success",{title:"rendering image",data:{},imagedata:base64Image});
                        
                        }
                        else
                        console.log(err);
                                    
                 });
       
      });
       
    
};

    var getImages=function(cb){
    
      var images=[];
      var imageItem={};
        //imageItem.src="http://photos.mykathua.com/i.ashx?&mid=99662445&mt=Photo&standardsize=1024x768";
       // imageItem.text="test";
       // images.push(imageItem);
            var baseUrl='http://www.kathua.nic.in/';
            //http://www.kathua.nic.in/images/brugges2006/1.jpg
           dex.scrape(baseUrl +'/gallery.htm',function(html){
            //var news=[]; 
            var $=cheerio.load(html);
            
            $('div.imageElement').each(function(i,e){
               
               imageItem={};
               var item=$(this);
               imageItem.src=baseUrl + item.find('img').attr('src'); 
               
               //imageItem.src=item.find('a').attr('href');
               imageItem.text=item.text();
               
               
               
               images.push(imageItem);
              
              
            });
                    
            
              cb(images);
              
              
            });
    
} 

    var getImagesSql=function(cb){
    
   
    data.getGalleryImages(null,function(err,images){
       
            cb(images);
        
    });
    
   
    
    
    
    

    

         
    
}

    
})(module.exports);