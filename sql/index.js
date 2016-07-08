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
    
    data.getStories  = function(param,cb){
    
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
        .then(function(recordset) {cb(null,recordset);})
        .catch(function(err) {cb(err);});
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
    data.getStoryComments  = function(option,cb){
        
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
            qry+="select sc.StoryCommentsId as id,ParentStoryId as parent,sc.CreatedDateTime as created , sc.Comments as content,isnull(case when u.displayName is null then u.FirstName + ' ' + u.LastName end,'Guest') as fullname";
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
          
                cb(null,recordset);
        	
        }).catch(function(err) {
    	
    	 console.log("error");
    	 cb(err,null);
    	 
    });
    });
     
    }
    // save story comments
    
    data.saveStoryComments  = function(data,cb){
    
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
    
    
    var request = new sql.Request();
    
    request.query(qry)
        .then(function(recordset) {cb(null,data);})
        .catch(function(err) {cb(err);});
    });
     
    }
    
    data.saveWebHit  = function(data,fnSuccess,fnError){
    
    sql.connect(config).then(function() {
    
    // var qry="select t.name,c.name from sys.tables t inner join sys.columns c on t.object_id=c.object_id where t.name like '%story%'";
    var qry="insert into [mykth].[WebHit](url,ipaddress)";
    
    qry+="  values ('" + data.url +"','" ;
    qry+= data.ipaddress +"')" ;
    
    
    var request = new sql.Request();
    
    request.query(qry)
        .then(function(recordset) {fnSuccess(data);})
        .catch(function(err) {fnError(err);});
    });
     
    }
    // like
    data.getWebHit  = function(data,fnSuccess,fnError){
    
    sql.connect(config).then(function() {
    
    // var qry="select t.name,c.name from sys.tables t inner join sys.columns c on t.object_id=c.object_id where t.name like '%story%'";
    //var qry="select count(1) as webhits from  [mykth].[WebHit] with (nolock);select * from mykth.webhit with (nolock)";
    var qry="select * from mykth.webhit with (nolock)";
    
    
    var request = new sql.Request();
    
    request.query(qry)
        .then(function(recordset) {fnSuccess(recordset);})
        .catch(function(err) {fnError(err);});
    });
     
    }
    
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
        
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {fnSuccess(recordset);})
            .catch(function(err) {fnError(err);});
    });
    
    };
    
    data.getMessages  = function(cb){
    
    sql.connect(config).then(function() {
    
        var qry="select * from [mykth].[Message] with(nolock) order by messageId desc";
       
       var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {
                
                cb(null,recordset);})
            .catch(function(err) {
                console.log(err);
                cb(err,null);});
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
    
    data.saveMessage  = function(param,cb){
    
    sql.connect(config).then(function() {
        
        var qry="insert into [mykth].[Message]([From],[To],[MessageBody]) values (";
       
        qry+= "'" + param.name + '|' + param.email + '|' + param.phone + "','";
        qry+="navs','";
        qry+=param.message + "'";
        
        qry+=");select 200 as code, 'message sent successfully' as message";
        
        console.log(qry);
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {
                //recordset.message="message sent successfully";
                cb(null,recordset[0]);}
                
                )
            .catch(function(err) {
                
              
              cb(err,null);
                
                
                
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
    
    data.executeSql  = function(cb){
    
    sql.connect(config).then(function() {
       
       //var qry="drop table mykth.jobs go create table [mykth].[jobs]([Id] int identity(1,1),[dated] datetime2 default getdate(),[jobid] varchar(25),[link] varchar(255),[position] varchar(255),[jobtext] nvarchar(max),[postdate] varchar(25))";
    
    var qry='';
    /*
    qry='create table mykth.[GalleryImageComment]('
    qry += 'id int identity (1,1)'
    qry += ',[CreatedDateTime] datetime default getdate()'
    qry += ',[GalleryImageId] [int] NULL'
    qry += ',[UserName] [nvarchar](15) NULL'
    qry += ',Comments nvarchar(max)'
    qry += ',[ParentGalleryId] [int] NULL'
    qry += ');';
    */
    qry +='drop table mykth.[GalleryImageCommentLike] ;create table mykth.[GalleryImageCommentLike]('
    qry += 'id int identity (1,1)'
    qry += ',[CreatedDateTime] datetime default getdate()'
    qry += ',[GalleryImageCommentId] [int] NULL'
    qry += ',[UserName] [nvarchar](15) NULL'
    qry += ',Comments nvarchar(max)'
    qry += ',[ParentGalleryId] [int] NULL'
    qry += ')';   
    
        var request = new sql.Request();
        
        request.query(qry)
            .then(function(recordset) {
                cb(null,recordset);})
            .catch(function(err) {
                console.log(err);
                cb(err,null);
                
                
                
            });
    });
    
    }
    
    data.saveNews=function(news,cb)    {
    
    
    sql.connect(config).then(function() {
    
    
    var request = new sql.Request();
    for(var i=0;i<news.length;i++)
    {
     var qry="insert into mykth.newsItems(newssource,link,news,[description],thumbnail) values ('";
    
    
    qry += news[i].newssource + "','";
    qry += news[i].link + "','";
    qry += news[i].news + "','";
    qry += news[i].description + "','";
    qry += news[i].thumbnail + "')";
    console.log(qry);
    
    request.query(qry)
    .then(function(recordset) {
    cb(null,recordset);})
    .catch(function(err) {
    
    console.log(err);
    
    cb(err);
    
    
    
    });
    }
    });
    
    
    
    }
    
    data.getNewsFromDb=function(cb)    {
    sql.connect(config).then(function() {
    
    var qry="select * from  mykth.newsItems";
    var request = new sql.Request();
    
    request.query(qry)
    .then(function(recordset) {
    cb(null,recordset);})
    .catch(function(err) {
    console.log(err);
    cb(err);
    
    
    
    });
    });
    
    }


  data.getGalleryImages  = function(param,cb){
    
    sql.connect(config).then(function() {
    
    var qry="select id,dated,caption as text,image_text,image_path as src from [mykth].[gallery]";
   
    //console.log(qry);
    var request = new sql.Request();
    
    request.query(qry)
        .then(function(recordset) {cb(null,recordset);})
        .catch(function(err) {cb(err);});
    });
    
    }
  
  data.getGalleryImageomments  = function(option,cb){
        //console.log(JSON.stringify(option));
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
            
             qry='create table mykth.[GalleryImageComment]('
            qry += 'id int identity (1,1)'
            qry += ',[CreatedDateTime] datetime default getdate()'
            qry += ',[GalleryImageId] [int] NULL'
            qry += ',[UserName] [nvarchar](15) NULL'
            qry += ',Comments nvarchar(max)'
            qry += ',[ParentGalleryId] [int] NULL'
            qry += ');';
            
            qry +=';create table mykth.[GalleryImageCommentLike]('
            qry += 'id int identity (1,1)'
            qry += ',[CreatedDateTime] datetime default getdate()'
            qry += ',[GalleryImageCommentId] [int] NULL'
            qry += ',[UserName] [nvarchar](15) NULL'
            qry += ',Comments nvarchar(max)'
            qry += ',[GalleryImageCommentId] [int] NULL'
            qry += ')';   
            
        */
           // var qry="select t.name,c.name from sys.tables t inner join sys.columns c on t.object_id=c.object_id where t.name like '%story%'";
           
           var qry=";with upvoteCount as (";
           
           qry +="select count(1) as upvote_count, [GalleryImageCommentId] from [mykth].GalleryImageCommentLike c group by [GalleryImageCommentId] )"
            qry+="select ic.Id as id,ParentGalleryId as parent,ic.CreatedDateTime as created , ic.Comments as content,isnull(case when u.displayName is null then u.FirstName + ' ' + u.LastName end,'Guest') as fullname";
            qry+=" ,ic.[Id] as galleryImageCommentId,case when ic.UserName ='" + option.username +"' then 1 else 0 end as created_by_current_user,isnull(uc.upvote_count,0) as upvote_count,u.profile_image_url as profilePictureURL" ;
            
            qry+="  from mykth.GalleryImageComment ic";
            qry+="  left join mykth.[User] u  with(nolock)";
            qry+=" on ic.UserName=u.UserName";
            qry+=" left join upvoteCount uc on ic.Id = uc.[GalleryImageCommentId]";
            qry+=" where (ic.GalleryImageId=" + option.galleryImageId + " or " + option.galleryImageId +"=0)";
            
            qry+=" order by ic.CreatedDateTime desc";
          //console.log(qry);
            var request = new sql.Request();
            request.query(qry).then(function(recordset) {
          
                cb(null,recordset);
        	
        }).catch(function(err) {
    	
    	 console.log("error");
    	 cb(err,null);
    	 
    });
    });
     
    }    
    
    data.saveGalleryImageComments  = function(data,cb){
    
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
    var qry="insert into [mykth].[GalleryImageComment](GalleryImageId,ParentGalleryId,UserName,Comments)";
    
    qry+="  values (" + data.galleryImageId +"," ;
    qry+= data.parent +"," ;
    qry+=" '" + data.username + "',";
    qry+="'" + data.comments +"');";
    
    
    var request = new sql.Request();
    
    request.query(qry)
        .then(function(recordset) {cb(null,data);})
        .catch(function(err) {cb(err);});
    });
     
    }
    
    data.upVoteGalleryImageComment  = function(data,fnSuccess,fnError){
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
        var qry="insert into [mykth].[GalleryImageCommentLike](GalleryImageCommentId,UserName)";
        qry+="  values (" + data.galleryImageCommentId +"," ;
        qry+=" '" + data.username + "')";
    console.log(qry);
        var request = new sql.Request();
        request.query(qry)
        .then(function(recordset) {fnSuccess(data);})
        .catch(function(err) {fnError(err);});
    });
    
    }

})(module.exports);