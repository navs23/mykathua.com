(function(galleryController){
    
   var 
   data =require("../sql");
    var cheerio = require('cheerio');
    var dex =require("../helper");
    
    galleryController.init= function(app){
        
    app.get("/gallery/",function(req,res){
        
       
      
       res.render("gallery/index",{title:"Photo Gallery",images:null,user:req.user});
      
    // });
        
       
        
      
    });
    
    app.get("/api/gallery/",function(req,res){
    /*
    getImages(function(images){
      
     console.log(images);
           
      res.send(images);
      
      
    });*/
    
    data.getGalleryImages(null,function(err,images){
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