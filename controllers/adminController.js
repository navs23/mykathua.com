(function(admin){
    var data =require("../sql/cms.js");
     var cmsData;
    admin.init=function(app){
        
       
           setTimeout(function(){
            console.log('setting up admin routes');   
            route(app);    
               
           },500);
           
    }
    
    
    var route=function(app){
       
        app.get('/admin/',function(req,res,next){
            
            
           //   if (req.isAuthenticated())
                return next();
          //  else 
            // res.redirect('/login/');
            
        },function(req,res,next){
            
             data.getWebsiteContentByPageAndSection(null,function(err,content){
               if (err==null)
               cmsData=content;
               else
               cmsData=[];
               // render admin page
                res.render('admin/index',{user:req.user,cmsData:cmsData});
               console.log(cmsData);
           });
           
           
            
        });
        
        
        app.get('/admin/getwebcontent',function(req,res){
           
          
           data.getWebsiteContentByPageAndSection(null,function(err,msg){
               if (err==null)
            res.send(msg);
            else 
            res.send(err);
               
           });
            
        });
        
        
        
        
        app.post('/admin/updatewebcontent',function(req,res){
           
           
           var params=req.body;
           
           console.log(JSON.stringify(params));
           
           data.updteWebsiteContent(params,function(err,msg){
               if (err==null)
                    res.send(params);
            else 
                res.send(err);
               
           });
            
        });
        
      
        app.get('/admin/sql',function(req,res){
           
           
           var qry="insert into mykth.cms(";

            qry += "page_code,section_code ,content";
            
            qry += ") values(";
            qry += "'home','header','this is header message')" ;
           
           data.executeSql(qry,function(err,msg){
               if (err==null)
            res.send('done');
            else 
            res.send(err);
               
           });
            
            
            
        });
        
       
        
        
    }
    
    
    
    
    
})(module.exports);