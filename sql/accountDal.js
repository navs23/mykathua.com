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
    	    var qry="select Firstname+ ' ' + lastname as Name,convert(varchar,CreatedDate,106) as [Member Since],isnull(Comments,'') as Notes from mykth.[User] with (nolock)"
    
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

})(module.exports);