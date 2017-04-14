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
    
    data.init= function(user){
        
        _user=user;
    }

    data.list = function(cb){
      
      sql.connect(config)
            .then(function() {
    	    var qry="select Firstname+ ' ' + lastname as Name,convert(varchar,CreatedDate,106) as [Member Since],isnull(Comments,'') as Notes from mykth.[User] with (nolock)";
    
            var request = new sql.Request();
            request.query(qry).then(function(recordset) {
            
            cb(null,recordset);
    
    	}).catch(function(err) {
    		
    		 console.log(err);
    	});
     });
    }
    
    // end getusers
    
    data.saveUser  = function(user,fnSuccess,fnError){
        console.log("saving user");
        sql.connect(config).then(function() {
        
        // update laslogindate column
        var qry="if not exists(select username from mykth.[user] where username ='" + user.username + "')begin ";
        qry +="insert into mykth.[user](Id,UserName,token,Password,email,displayName,profile_image_url,lastloginDate)values(";
        qry += "'" + user.id + "','" + user.username + "','" + user.token + "','" + user.password + "','" + user.email + "','" + user.displayName + "','" + user.profile_image_url 
         qry += "',getdate() ";
        qry +=")" ;
         qry +=" end";
          qry +=" else begin update mykth.[user] set lastloginDate=getdate() where username='" + user.username +"' end";
          
          
          
       // values ('703646797646995457','' ,'703646797646995457-mUvHGxvX9mwrSsVa69Cy51RW3sHxwDh','mykathua','','kathua','https://pbs.twimg.com/profile_images/703647887561981952/TCiAB3OV_normal.jpg')
        var request = new sql.Request();
        console.log(qry);
        request.query(qry)
            .then(function(recordset) {fnSuccess(user);})
            .catch(function(err) {fnError(err);});
        });
    
    }

    data.deleteUser  = function(user,fnSuccess,fnError){

    sql.connect(config).then(function() {

    var qry="delete from mykth.user where ";
     
    qry+=" order by s.CreatedDate desc";
    
    var request = new sql.Request();
    request.query(qry)
    .then(function(recordset) {fnSuccess(recordset);})
    .catch(function(err) {fnError(err);});
});

}

    data.createNewsTable = function(cb){
    var sql='create table mykth.newsItems('
sql += 'id int identity (1,1)'
sql += ',dated datetime default getdate()'
sql += ',newsSource varchar(50)'
sql += ',link nvarchar(255)'
sql += ',news nvarchar(max)'
sql += ',[description] nvarchar(max)'
sql += ',thumbnail nvarchar(255)'
 sql += ')';
    
     var request = new sql.Request();
    request.query(sql)
    .then(function(recordset) {cb(null,recordset);})
    .catch(function(err) {cb(err);});
}

    data.listUser  = function(fnSuccess,fnError){

    sql.connect(config).then(function() {

    var qry="select * from mykth.[user] ";
     
    qry+=" order by lastlogindate desc";
    
    var request = new sql.Request();
    request.query(qry)
    .then(function(recordset) {fnSuccess(recordset);})
    .catch(function(err) {fnError(err);});
});

}

  data.findUser = function(data,cb){
         //
      
         sql.connect(config).then(function() {
        /*     
        var qry="select top 1 UserId, CreatedDate,    LastModifiedDate,    LastLoginDate,    UserName as username,    Email as email,    [Password] as [password],    PasswordSalt,"
        qry+="LastLogin1p,    IsActivated,    IsLockedOut,    LastLockedOutDate,    LastLockedOutReason,    NewPasswordKey,    NewPasswordRequested,    NewEmail,";
        qry+="NewEmailKey,    NewEmailRequested,    FirstName,LastName,    (FirstName + LastName)  as displayName,    profile_image_url, id from mykth.[User] with (nolock)";
        qry+=" where (username='" + data.username + "' or email='" + data.username + "')";
        */
        var qry="select top 1 '' as errorCode,Id, UserId,  UserName as username, Email as email,    [Password] as [password]"
        qry+=",displayName from mykth.[User] with (nolock) ";
        qry +=" where (username='" + data.username + "' or email='" + data.username + "') and [IsActivated] =1";
        qry +=" or (token ='" + (data.token || '999') + "')";
        
        console.log(qry);
       
       var request = new sql.Request();
   
      request.query(qry)
        .then(function(user) {
            console.log(JSON.stringify(user));
            return cb(null,user[0]);})
        .catch(function(err) {
                console.log('error..');
                return cb(err,null);
                }
            
            );
    
    });
    
    //cb(null,{username:'navs',password:'nav33n'})
        
            
    }
    
    
     data.registerUser  = function(user,cb){
        console.log("registering user");
        
        sql.connect(config).then(function() {
        
        // update laslogindate column
        var qry="if exists(select username from mykth.[user] where email ='" + user.username + "' ) begin ";
        
        qry +="select 107 as errorCode,'email alrady registered' as errorMessage";
        
        qry +=" end";
        
        qry +=" else if exists(select username from mykth.[user] where email ='" + user.username + "') begin ";
        
        qry +="select 108 as errorCode,'email address already in use' as errorMessage";
        
        qry +=" end";
        
        
        qry +=" else begin insert into mykth.[user](UserName,Password,email,displayName,token,IsActivated)values(";
        qry += "'" + user.username + "','" + user.password1 + "','" + user.username + "','" + user.name + "',newid(),0" 
        
        qry +=")" ;
        
        qry +=" select '' as errorCode,'' as errorMessage, UserName,email,displayName,token,'' as message from mykth.[user] where username ='" + user.username + "'";
        qry +=" end";
        
       // values ('703646797646995457','' ,'703646797646995457-mUvHGxvX9mwrSsVa69Cy51RW3sHxwDh','mykathua','','kathua','https://pbs.twimg.com/profile_images/703647887561981952/TCiAB3OV_normal.jpg')
        var request = new sql.Request();
        console.log('sql query\n %s',qry);
        request.query(qry)
            .then(function(recordset) {
                console.log("%s,%s",'message -',JSON.stringify(recordset));
                return cb(null,recordset);})
                
            .catch(function(err) {
                
                return cb(err,null);}
                );
        });
    
    }
     data.activateUser  = function(user,cb){
        console.log("activating user");
        
        sql.connect(config).then(function() {
        
        // update laslogindate column
         var qry="if not exists(select username from mykth.[user] where token ='" + user.tocken + "') select 200 as errorCode,'Ooops..., invalid request.' as message";
        
        qry +=" else if exists(select username from mykth.[user] where token ='" + user.tocken + "' and IsActivated=0) begin ";
        
        qry +="update  mykth.[user] set IsActivated=1,LastModifiedDate=getdate() where token='"+ user.tocken + "'";
        qry +=";select 201 as errorCode,'Your account has successfully been activated.' as message";
        qry +=" end";
        
        qry +=" else begin ";
        
        qry +="select 109 as errorCode,'Your account has already been activated.' as message";
        qry +=" end";
        
       // values ('703646797646995457','' ,'703646797646995457-mUvHGxvX9mwrSsVa69Cy51RW3sHxwDh','mykathua','','kathua','https://pbs.twimg.com/profile_images/703647887561981952/TCiAB3OV_normal.jpg')
        var request = new sql.Request();
        console.log(qry);
        request.query(qry)
            .then(function(recordset) {
                console.log("%s,%s",'message -',JSON.stringify(recordset));
                return cb(null,recordset);})
                
            .catch(function(err) {
                
                return cb(err,null);}
                );
        });
    
    }

   data.updatePassword  = function(param,cb){
        console.log("reseting password");
        
        sql.connect(config).then(function() {
        
        // update laslogindate column
        var qry="if exists(select username from mykth.[user] where NewPasswordKey ='" + param.tocken + "') begin ";
        
        qry +="update  mykth.[user] set password='" + param.password1 + "',LastModifiedDate=getdate(),NewPasswordKey=null where NewPasswordKey='"+ param.tocken + "'";
        qry +=" select 201 as errorCode,'password successfully updated' as errorMessage";
        qry +=" end";
        
        qry +=" else begin ";
        
        qry +="select 109 as errorCode,'invalid request' as errorMessage";
        qry +=" end";
        
       // values ('703646797646995457','' ,'703646797646995457-mUvHGxvX9mwrSsVa69Cy51RW3sHxwDh','mykathua','','kathua','https://pbs.twimg.com/profile_images/703647887561981952/TCiAB3OV_normal.jpg')
        var request = new sql.Request();
        console.log(qry);
        request.query(qry)
            .then(function(recordset) {
                console.log("%s,%s",'return message -',JSON.stringify(recordset));
                return cb(null,recordset);})
                
            .catch(function(err) {
                
                return cb(err,null);}
                );
        });
    
    }
    
     data.generatePasswordResetTocken  = function(param,cb){
        console.log("generating password reset tocken");
        
        sql.connect(config).then(function() {
        
        // update laslogindate column
        var qry="if exists(select email from mykth.[user] where email ='" + param.email + "') begin ";
        
        qry +="update  mykth.[user] set NewPasswordKey=newid(),LastModifiedDate=getdate() where email='"+ param.email + "'";
        qry +="  select top 1 UserName,isnull(case when displayName is null then FirstName + ' ' + LastName end,'User') as displayName,email,NewPasswordKey as tocken,'' as message from mykth.[user] where email ='" + param.email + "'";
        qry +=" end";
        
        qry +=" else begin ";
        
        qry +="select 110 as errorCode,'Could not find email address in our system' as errorMessage";
        qry +=" end";
        
       // values ('703646797646995457','' ,'703646797646995457-mUvHGxvX9mwrSsVa69Cy51RW3sHxwDh','mykathua','','kathua','https://pbs.twimg.com/profile_images/703647887561981952/TCiAB3OV_normal.jpg')
        var request = new sql.Request();
        console.log(qry);
        request.query(qry)
            .then(function(recordset) {
                
                console.log("%s,%s",'return message -',JSON.stringify(recordset));
                
                return cb(null,recordset[0]);})
                
            .catch(function(err) {
                console.log(err);
                return cb(err,null);}
                );
        });
    
    }
    

})(module.exports);