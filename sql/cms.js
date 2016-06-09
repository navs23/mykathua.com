(function(cms){
    
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
    
    cms.init=function(user){
    
    _user=user;
    }
    
    
    
    cms.getWebsiteContentByPageAndSection  = function(params,cb){
    
    sql.connect(config).then(function() {
    
    
    var qry="select * from mykth.cms";
    
    var request = new sql.Request();
    
    request.query(qry)
        .then(function(recordset) {cb(null,recordset);})
        .catch(function(err) {cb(err,null);});
    });
     
    }
    
    cms.updteWebsiteContent  =function(params,cb){
    
    sql.connect(config).then(function() {
    
    // var qry="select t.name,c.name from sys.tables t inner join sys.columns c on t.object_id=c.object_id where t.name like '%story%'";
    //var qry="select count(1) as webhits from  [mykth].[WebHit] with (nolock);select * from mykth.webhit with (nolock)";
    
    var qry="if exists(select id from mykth.cms where page_code='" + params.page + "' and section_code='" + params.section + "') begin";
    
    qry += " update mykth.cms set content ='" + params.content + "'";
    qry += " where page_code='" + params.page + "'";
    qry += " and section_code='" + params.section + "'";
    qry += " end else begin "
    
    qry +="insert into mykth.cms(page_code,section_code ,content) values('";
    
    qry += params.page +"','";
    qry += params.section +"','";
    qry += params.content +"')";
    
    qry += " end";
    
    console.log(qry);
    var request = new sql.Request();
    
    request.query(qry)
        .then(function(recordset) {cb(null,recordset);})
        .catch(function(err) {cb(err,null);});
    });
     
    }
    
    
    
    cms.executeSql  = function(qry,cb){
    
    sql.connect(config).then(function() {
       
       //var qry="drop table mykth.jobs go create table [mykth].[jobs]([Id] int identity(1,1),[dated] datetime2 default getdate(),[jobid] varchar(25),[link] varchar(255),[position] varchar(255),[jobtext] nvarchar(max),[postdate] varchar(25))";
   /*
var qry='create table mykth.cms('
qry += 'id int identity (1,1)'
qry += ',dated datetime default getdate()'
qry += ',page_code varchar(15)'
qry += ',section_code nvarchar(25)'
qry += ',content nvarchar(max)'
qry += ',[image_path] nvarchar(max)'
 qry += ')';
   
   */
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
    




})(module.exports);