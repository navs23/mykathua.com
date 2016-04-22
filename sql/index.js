(function(data){
    
    var sql = require('mssql');
    var _user={};
    
    var config = {
        user: 'navs',
        password: 'Myk@thu0',
        server: 'navs.db.9284416.hostedresource.com', // You can use 'localhost\\instance' to connect to named instance 
        database: 'navs',
     
        options: {
            encrypt: false // Use this if you're on Windows Azure 
        }
    }
    data.init=function(user){
        
        _user=user;
    }
    
    data.getUsers = function(next){
      
      sql.connect(config).then(function() {
    	var qry="select Firstname+ ' ' + lastname as Name,convert(varchar,CreatedDate,106) as [Member Since],isnull(Comments,'') as Notes from mykth.[User] with (nolock)"
    
    	var request = new sql.Request();
    	request.query(qry).then(function(recordset) {
    	  
    	  
    	  
    	  next(null,recordset);
    		
    		// console.log(3);
    		
    	}).catch(function(err) {
    		
    		 console.log(err);
    	});
     });
    }
     // end getusers
    
    data.getStories  = function(param,fnSuccess,fnError){
    
    sql.connect(config).then(function() {
    
        var qry="select s.StoryId as StoryId,u.Firstname + ' ' + u.lastname as PostedBy,s.CreatedDate as [Dated],'<a href=\"#\" onclick=\"displayStory(' + convert(varchar,storyid) +');\">' + s.Title  +'</a>' as Title";
        qry+=",s.Content from mykth.Story s with(nolock)";
        qry+="  inner join mykth.[User] u  with(nolock)";
        qry+=" on s.CreatedBy=u.UserName";
        
        qry+=" where (StoryId=" + param.storyId + " or " + param.storyId +"=0)";
        qry+=" and isnull(showOnHomePage,0)=" +  param.showOnHomePage;
        qry+=" order by s.CreatedDate desc";
        //console.log(qry);
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {fnSuccess(recordset);})
            .catch(function(err) {fnError(err);});
    });
    
    }

    data.getStory  = function(param,fnSuccess,fnError){
        
       sql.connect(config).then(function() {
        
            var qry="select s.StoryId as StoryId,u.Firstname + ' ' + u.lastname as PostedBy,s.CreatedDate as Dated,s.Title , s.Content";
            qry+=" from mykth.Story s with(nolock)";
            qry+="  inner join mykth.[User] u  with(nolock)";
            qry+=" on s.CreatedBy=u.UserName";
            qry+=" where (StoryId=" + param.storyId + " or " + param.storyId +"=0)";
             
            qry+=" order by s.CreatedDate desc";
            
            var request = new sql.Request();
            request.query(qry).then(function(recordset) {
          
                fnSuccess(recordset);
        	
        	   // console.log(3);
        	
        }).catch(function(err) {
    	
    	 console.log("error");
    	 fnError(err);
    	 
    });
    });
     
    }

    // get comments
    data.getStoryComments  = function(option,fnSuccess,fnError){
            
           sql.connect(config).then(function() {
            /*
                "id": 1,
                "parent": null,
                "created": "2015-01-01",
                "modified": "2015-01-01",
                "content": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
                "fullname": "Simon Powell",
                "profile_picture_url": "https://app.viima.com/static/media/user_profiles/user-icon.png",
                "created_by_admin": false,
                "created_by_current_user": false,
                "upvote_count": 3,
                "user_has_upvoted": false
            */
               // var qry="select t.name,c.name from sys.tables t inner join sys.columns c on t.object_id=c.object_id where t.name like '%story%'";
               
               var qry=";with upvoteCount as (";
               
               qry +="select count(1) as upvote_count, [StoryCommentsId] from [mykth].StoryCommentsLike c group by [StoryCommentsId] )"
                qry+="select sc.StoryCommentsId as id,ParentStoryId as parent,sc.CreatedDateTime as created , sc.Comments as content,isnull(u.displayName,'Guest') as fullname";
                qry+=" ,case when sc.UserName ='" + option.username +"' then 1 else 0 end as created_by_current_user,isnull(uc.upvote_count,0) as upvote_count,u.profile_image_url as profilePictureURL" ;
                
                qry+="  from mykth.StoryComments sc";
                qry+="  left join mykth.[User] u  with(nolock)";
                qry+=" on sc.UserName=u.UserName";
                qry+=" left join upvoteCount uc on sc.StoryCommentsId = uc.StoryCommentsId";
                qry+=" where (sc.StoryId=" + option.storyId + " or " + option.storyId +"=0)";
                
                qry+=" order by sc.CreatedDateTime desc";
               console.log(qry);
                var request = new sql.Request();
                request.query(qry).then(function(recordset) {
              
                    fnSuccess(recordset);
            	
            }).catch(function(err) {
        	
        	 console.log("error");
        	 fnError(err);
        	 
        });
        });
         
    }
// save story comments
    
    data.saveStoryComments  = function(data,fnSuccess,fnError){
        
    sql.connect(config).then(function() {
    /*
        "id": 1,
        "parent": null,
        "created": "2015-01-01",
        "modified": "2015-01-01",
        "content": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
        "fullname": "Simon Powell",
        "profile_picture_url": "https://app.viima.com/static/media/user_profiles/user-icon.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "upvote_count": 3,
        "user_has_upvoted": false
    */
       // var qry="select t.name,c.name from sys.tables t inner join sys.columns c on t.object_id=c.object_id where t.name like '%story%'";
        var qry="insert into [mykth].[StoryComments](StoryId,ParentStoryId,UserName,Comments)";
        
        qry+="  values (" + data.storyId +"," ;
        qry+= data.parent +"," ;
        qry+=" '" + data.username + "',";
        qry+="'" + data.comments +"');";
      
       console.log(qry);
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {fnSuccess(data);})
            .catch(function(err) {fnError(err);});
    });
         
    }

// like

data.upVoteStoryComment  = function(data,fnSuccess,fnError){
       // console.log(JSON.stringify(data));
       sql.connect(config).then(function() {
        /*
            "id": 1,
            "parent": null,
            "created": "2015-01-01",
            "modified": "2015-01-01",
            "content": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
            "fullname": "Simon Powell",
            "profile_picture_url": "https://app.viima.com/static/media/user_profiles/user-icon.png",
            "created_by_admin": false,
            "created_by_current_user": false,
            "upvote_count": 3,
            "user_has_upvoted": false
        */
           // var qry="select t.name,c.name from sys.tables t inner join sys.columns c on t.object_id=c.object_id where t.name like '%story%'";
            var qry="insert into [mykth].[StoryCommentsLike](StoryCommentsId,UserName)";
            qry+="  values (" + data.storyId +"," ;
            qry+=" '" + data.username + "')";
    
            var request = new sql.Request();
            request.query(qry)
            .then(function(recordset) {fnSuccess(data);})
            .catch(function(err) {fnError(err);});
    });
     
}

//insert into [mykth].[StoryCommentsLike](StoryCommentsLikeId,StoryCommentsId,UserName) values ()

//select [Id] ,[Dated],[UserId],[Heading],[CategoryCode],	[Advert],[PhoneNumber],	[EmailAddress] from [mykth].[Classified] with(nolock) order by category, dated desc

 data.getClassifiedAds  = function(param,fnSuccess,fnError){
    
    sql.connect(config).then(function() {
    
        var qry="select [Id] ,[Dated],[UserId],[Heading],[CategoryCode],[Advert],[PhoneNumber],	[EmailAddress] from [mykth].[Classified] with(nolock)";
        
        qry+=" order by categoryCode, dated desc";
        console.log(qry);
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {fnSuccess(recordset);})
            .catch(function(err) {fnError(err);});
    });
    
    };
    data.getMessages  = function(param,fnSuccess,fnError){
    
    sql.connect(config).then(function() {
    
        var qry="select MessageId,[From],[To],[MessageBody] as [Message] from [mykth].[Message] with(nolock) order by messageId desc";
       
        console.log(qry);
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {
                console.log(recordset);
                fnSuccess(recordset);})
            .catch(function(err) {
                console.log(err);
                fnError(err);});
    });
    
    };
    

    data.saveClassifiedAd  = function(param,fnSuccess,fnError){
    
    sql.connect(config).then(function() {
    
        var qry="insert into [mykth].[Classified]([UserId],[Heading],[CategoryCode],[Advert],[PhoneNumber],[EmailAddress]) values (";
        //var qry="insert into [mykth].[Classified]([Id] ,[UserId],[Heading],[CategoryCode],[Advert],[PhoneNumber],[EmailAddress]) values (";
        
        //qry+= param.id + ",";
        qry+= "'" + param.userId + "','";
        qry+=param.heading + "','";
        qry+=param.categoryCode + "','";
        qry+=param.advert + "','";
        qry+=param.phonenumber + "','";
        qry+=param.emailaddress + "'";
        qry+=")";
        console.log(qry);
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {fnSuccess(recordset);})
            .catch(function(err) {fnError(err);});
    });
    
    }

    data.saveMessage  = function(param,fnSuccess,fnError){
    
    sql.connect(config).then(function() {
        
        var qry="insert into [mykth].[Message]([From],[To],[MessageBody]) values (";
        //var qry="insert into [mykth].[Classified]([Id] ,[UserId],[Heading],[CategoryCode],[Advert],[PhoneNumber],[EmailAddress]) values (";
        
        //qry+= param.id + ",";
        qry+= "'" + param.name + '|' + param.email + '|' + param.phone + "','";
        qry+="navs','";
        qry+=param.message + "'";
        
        qry+=");select 'message sent successfully' as message";
        
        console.log(qry);
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {
                //recordset.message="message sent successfully";
                fnSuccess(recordset);}
                
                )
            .catch(function(err) {
                
                console.log((err));
                fnError(err);
                
                
                
            });
    });
    
    };

 data.saveJob  = function(jobItem,fnSuccess,fnError){
    
    sql.connect(config).then(function() {
        /*
        jobItem={};
            jobItem.img = $(e).find('img').attr('src');
            
            jobItem.link=$(e).find('div.post-thumb a').attr('href');
            jobItem.position = $(e).find('div.post-thumb a').attr('title');
            jobItem.jobText = $(e).find('div.post-content').text().trim().replace('...Read More','');
            jobItem.postDate = $(e).find('i.icon-time').text().trim();
            jobItem.id ="jb" + i;
    */
        //var qry="drop table mykth.jobs go create table [mykth].[jobs]([Id] int identity(1,1),[dated] datetime2 default getdate(),[jobid] varchar(25),[link] varchar(255),[position] varchar(255),[jobtext] nvarchar(max),[postdate] varchar(25))";
        var qry="if not exists (select id from mykth.jobs where link='" + jobItem.link +"') begin";
        qry += "insert into mykth.jobs ([jobid] ,[link],[position],[jobtext] ,[postdate]) values ('";
        qry += jobItem.jobid + "',";
        qry += jobItem.link + "',";
        qry += jobItem.position + "',";
        qry += jobItem.jobText + "',";
        qry += jobItem.postDate + "') end";
       
        console.log(qry);
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {fnSuccess(recordset);})
            .catch(function(err) {fnError(err);});
    });
    
    }
 data.executeSql  = function(param,fnSuccess,fnError){
    
    sql.connect(config).then(function() {
       
        var qry="drop table mykth.jobs go create table [mykth].[jobs]([Id] int identity(1,1),[dated] datetime2 default getdate(),[jobid] varchar(25),[link] varchar(255),[position] varchar(255),[jobtext] nvarchar(max),[postdate] varchar(25))";
   
        console.log(qry);
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {fnSuccess(recordset);})
            .catch(function(err) {fnError(err);});
    });
    
    }

})(module.exports);