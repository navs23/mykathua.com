(function(galleryController){
    
   var data =require("../sql");
    var cheerio = require('cheerio');
    var dex =require("../helper");
    
    galleryController.init= function(app){
        
        app.get("/gallery/",function(req,res){
            
           // getImages(function(images){
         // res.send(images);
          
           res.render("gallery/index",{title:"Photo Gallery",images:null,user:req.user});
          
     // });
            
           
            
          
        });
        
    app.get("/api/gallery/",function(req,res){
        
      getImages(function(images){
          
         
               
          res.send(images);
          
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



    
})(module.exports);