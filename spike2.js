var data =require('./sql/index.js');
/*
 var qry="insert into [mykth].[gallery](caption,image_text,image_path)";
    
    qry+="  values ('" + param.caption +"','" ;
    qry+= param.image_text +"','" ;
    qry+= param.image_path + "')";
    */
    var fileId ="F3hggj7EI8VeM0GFb3NSu0wX45111LwVobgwFD1iPOSc=";
    var param={};
    param.caption ='test';
    param.image_text='testing..';
    param.image_path = '/showimage/' + fileId ;
    /*
    data.saveGalleryImage(param,function(err,recordset){
                
                if (!err)
                {
                    
                    console.log(recordset);
                   
                }
      
      else{
        console.log('error');
      console.log(err);
      }
    });
    */
    