/*
node-cache module added
*/
"use strict";
(function(mediaController){
    
    var data =require("../sql");
    
    var twt =require("../helper/tweet.js");
    
    var news = require("../news");
    var videos = require("../videos");

    //var newsItemCache;
    
   
   // landing page;
    mediaController.init= function(app){
    
    news.setNewsdb(app.dbNews);
    routes(app);
    
    }
    
   
    var routes=function(app){

             app.get("/news/",function(req,res,next){
               
                news.GetNewItemsFromSql(function(err,temp){
                    if (err==null)
                    {
                            videos.search({searchStr:'kathua'},function(data){
                            res.render("media/index",{user:req.user,news:temp,videos:data,title:"Kathua in news, get latest national, state and kathua news on mykathua.com"});          
                    
                });
                    
                    }
                else
                
                        res.render(err);          
                });
                
                
            });
             app.get("/videos/",function(req,res,next){
               
               
                            videos.search({searchStr:'kathua'},function(data){
                                console.log(data);
                                //for(var i =0;i<data.length;i++)
                                //console.log(JSON.stringify(data[0]));
                                
                            res.render("media/videos",{user:req.user,videos:data,title:"Latest videos about Kathua"});          
                    
                });
                    
                
                
            });
            app.get("/api/news/",function(req,res,next){
                
                
                console.log('getting news');
                 news.NewItemsAsync(function(err,result){
                     
                res.send(result);
                 });
                //next();
            
            });
            
             app.get("/api/newsfromSQL/",function(req,res,next){
                
                
                console.log('getting news');
                 news.GetNewItemsFromSql(function(err,result){
                     
                res.send(result);
                 });
                //next();
            
            });
            // publish local stories
            
            app.get("/api/stories",function(req,res){
                
            //console.log(req.url);
            var param={}
             param.storyId = req.query.storyId;
             param.showOnHomePage = req.query.showOnHomePage;
             
            var message='';
            
            if (param.storyId == undefined ) message ='invalid story Id';
            if (param.showOnHomePage == undefined ) param.showOnHomePage=0;
            
            if (message !='')
            {
               // console.log(req.query); 
                res.send(req.query);
                res.end();
                return;
            }
            data.getStories(param,
            
                    function(results){
            	            res.send(results);
            	            res.end();
            	
                },function(err){
                        console.log(err);
            	        res.render(err);
                });
                   
            });
                    
            app.get("/api/getStory/",function(req,res){
            
            //console.log(req.url);
            var param={}
            param.storyId = req.query.storyId;
            
            
            var message='';
            
            if (param.storyId == undefined ) message ='invalid story Id';
            
            
            if (message !='')
            {
            // console.log(req.query); 
            res.send(req.query);
            res.end();
            return;
            }
            data.getStory(param,
            
                function(results){
                        res.send(results);
                        res.end();
            
            },function(err){
                   // console.log(err);
                    res.render(err);
            });
               
            });
                    
            // get story comments
            app.get("/api/StoryComments/:storyId",function(req,res){
            
            var storyId = req.params.storyId;
            console.log(storyId);
            var option={};
            option.storyId = storyId;
            data.getStoryComments(option,
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
                    
            app.get("/api/SaveComments/:storyId/:parent/:comments",function(req,res,next){
            
            
            if (req.user == undefined || req.user == null) {
                res.send({error:'invalid user details',errorMessage:'Please login to upload comments'});
                return;
            }
            
            var storyId = req.params.storyId;
            
            var commentData={};
            commentData.storyId =storyId;
            commentData.parent =req.params.parent;
            commentData.username =req.user.username;
            commentData.comments =req.params.comments;
            commentData.created = new Date();
            
            data.saveStoryComments(commentData,function(err,results){
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
            
            app.get("/api/UpVoteStoryComment/:storyId/:username",function(req,res,next){
            //console.log(req.url);
            var storyId = req.params.storyId;
            
            var commentData={};
            commentData.storyId =storyId;
            
            commentData.username =req.params.username;
            
             	data.upVoteStoryComment(commentData,
                    function(results){
            	            res.send(results);
            	            //res.end();
            	
                },function(err){
                        console.log(err);
                         //res.send(err);
                         return next(err);
            	        
                });
                   
            });
            
            // get story comments
            app.get("/api/getTweets/",function(req,res,next){
                
                try{
                 
               twt.getTweets(function(data){
                   console.log(data);
                    res.send(data);
               });
                }
                catch(err){
                    
                    return next(err);
                }
                 
            });
                    
            app.get("/callback",function(req,res){
            console.log('cb from twitter');
            //res.send('call back from twitter');
            //res.end(); 
            });
            
            app.get("/api/videos/:video",function(req,res){
            console.log(req.params.video);
                videos.search({searchStr:'kathua'},function(data){
                   res.send(data);
                    
                });

    
                
            });
           
    
    }

 
       
    
})(module.exports);