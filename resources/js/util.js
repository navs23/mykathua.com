
var util = (function(){
   
return {

    searliseJsonIntoHtmlTable:function (jsonData) {
        
        var tableHeadRow = '';
        var tableDataRow = '';
        var tableFooter = '';
        var iTemp = 1;
        var html = '';
        // get header row
        for (var obj in jsonData) {
            if (iTemp > 1) break;
            if (jsonData.hasOwnProperty(obj)) {
    
                for (var prop in jsonData[obj]) {
    
                    if (jsonData[obj].hasOwnProperty(prop)) {
    
                        tableHeadRow += '<td>' + prop + '</td>';
                    }
                }
            }
            iTemp++;
        }
        tableHeadRow = '<tr style="font-weight:bold;">' + tableHeadRow + '</tr>';
        // get data rows
        for (var obj in jsonData) {
            tableDataRow += '<tr >';
            if (jsonData.hasOwnProperty(obj)) {
    
                for (var prop in jsonData[obj]) {
    
                    if (jsonData[obj].hasOwnProperty(prop)) {
                        /* */
                        var temp='';
                        var cellValue = jsonData[obj][prop];
    
                      
                        tableDataRow += '<td>' + cellValue + '</td>';
                        
                    }
                }
            }
            tableDataRow += '</tr>';
    
    
        }
    
        html = '<table class="table table-hover"><thead>' + tableHeadRow + '</thead><tbody>' + tableDataRow + '</tbody>';
    
    
        html += '</table>';
        if (tableDataRow == '') {
            html = "<i>No changes were found</i>"
        }
        return html;
    }
    ,
    getJsonData: function (url, data) {
    
       
        
        var retVal;
        $.ajax({
            async: false,
            url: url,
            data: data,
    
            type: 'Get',
            success: function (data) {
    ;
                retVal = data;
                
            },
            fail: function () {
                alert("error");
            }
            , error: function (xhr, errorType, exception) {
                OnError(xhr, errorType, exception);
            }
        });
        
       return retVal;
    
    },
    
    getJsonDataAsync : function (url, options,errorCb, successCb) {
    
        $.ajax({
            async: true,
            url: url,
            data: options,
    
            type: 'Get',
            success: function (jsonVal) {
                successCb(jsonVal);
                
            },
            fail: function () {
               errorCb('error');
               
            }
            , error: function (xhr, errorType, exception) {
                errorCb(xhr, errorType, exception);
                
            }
        });
     }
    
    
    ,showHideComment: function(storyId){
        
       // alert(storyId);
       util.getStoryComments(storyId);
       $('#divComment' + storyId).toggle();
     
    }
    ,getStoryComments: function(options,cberror,cbsuccess)
    {
        //alert(JSON.stringify(options));
        /*
        configureComments({
        Id:options.id,  
        commentGetUrl:'/api/StoryComments/' ,
        commentSaveUrl:'/api/SaveComments/',
        commentLikeSaveUrl:'/api/UpVoteStoryComment/',
        div:'#divComment'}
        ,function(err,data){
            alert(err);
        }
        );
        return;*/
        var url='/api/StoryComments/'+options.id;;
        var div='#divComment' +options.id;
        
        $(div).empty();
       
        util.getJsonDataAsync(url,{storyId:options.id},function(er){
            
          
        },function(data){
           
          // alert(JSON.stringify(data));
                $(div).comments({
                    
            					//profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/user_profiles/user-icon.png',
            					roundProfilePictures: true,
            					textareaRows: 1,
            					enableAttachments: false,
            					
                                enableEditing: false,
    
            					getComments: function(success, error) {
            					    //alert(data);
            					    success(data);
            							
            						},
            					postComment: function(data, success, error) {
            					   
            					    data.created= new Date();
            					     //alert(JSON.stringify(data));
            						setTimeout(function() {
            							
                                    var saveurl='/api/SaveComments/' + options.id;
                                    saveurl +="/" + data.parent;
                                   // saveurl +="/" + "navs";
                                    saveurl +="/" + data.content;
                                   // console.log(saveurl);
                                    //getJsonDataAsync(saveurl,{storyId:Id,username:'navs',comments:data.content},function(er){
                                    util.getJsonDataAsync(saveurl,null,function(er){    
                                    
                                        //alert('error');
                                        $(options.diverr).html('<span style="color:red">' + er +'</span>');
                                        
                                    },function(data) {
                                        //alert('error - 2');
                                        if (data.errorMessage != undefined || data.errorMessage != null) {
                                           // alert(options.diverr);
                                            //alert(data.errorMessage);
                                            //$(divError).val(data.errorMessage);
                                             $(options.diverr).html('<span style="color:red">' + data.errorMessage +'</span>');
                                           //cberror(data.errorMessage);
                                            
                                        }
                                        else
                                        {
                                             //alert(options.id);
                                             util.getStoryComments(options);
                                             //success(data);
                                             cbsuccess(options);
                                             //refresh();
                                        }
                                        
                                        
                                    });
                                    
            						}, 500);
            					},
            					putComment: function(data, success, error) {
            						setTimeout(function() {
            							
            							//alert(3);
            						}, 500);
            					},
            					deleteComment: function(data, success, error) {
            						setTimeout(function() {
            							//success();
            						//	alert(data);
            							$(options.diverr).html('<span style="color:red">' + data +'</span>');
            							
            						}, 500);
            					},
            					upvoteComment: function(data, success, error) {
            						setTimeout(function() {
            							//success(data);
            						//	alert(JSON.stringify(data));
            							
                                        var saveurl='/api/UpVoteStoryComment/' + data.id;
                                        
                                        saveurl +="/" + "navs";
                                        
                                       // console.log(saveurl);
                                        
                                        util.getJsonDataAsync(saveurl,null,function(er){    
                                        
                                        
                                        },function(data) {
                                        
                                        util.getStoryComments(options.id);
                                        
                                        
                                        });
            							
            						}, 500);
            					},
            					uploadAttachments: function(dataArray, success, error) {
            						setTimeout(function() {
            							//success(dataArray);
            							//alert(data);
            							
            						}, 500);
            					},
            					refresh: function() {
            					   
                                            $(div).addClass('rendered');
                                        }
            				});
        });
    }
    
    ,getGalleryImageomments: function(options,cb)
    {
     /*
     global $
     */
     ///alert(options.id);
        var params = {
        Id:options.id,  
        commentGetUrl:'/api/gallery/getComments/' ,
        commentSaveUrl:'/api/gallery/SaveComments/',
        
        commentLikeSaveUrl:'/api/gallery/UpVoteComment/',
        div:'#divComment'+options.id,
        divError :'#divError'
            
        };
        util.configureComments(params
        ,function(err,data){
            $(params.divError).text(err);
        }
        );
     
        var commentGetUrl='/api/gallery/getComments/' + options.id; ;
        var commentSaveUrl='/api/gallery/SaveComments/';
        var commentLikeSaveUrl='/api/gallery/UpVoteComment/';
       // alert(options.id);
        //var url='/api/StoryComments/'+options.id;
        var div='#divComment'  + options.id;
        //alert(JSON.stringify(options));
        //alert(commentGetUrl);
        $(div).empty();
       
        util.getJsonDataAsync(commentGetUrl,null,function(er){
            //alert(commentGetUrl);
          
        },function(data){
           
           
                $(div).comments({
                    
            					//profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/user_profiles/user-icon.png',
            					roundProfilePictures: true,
            					textareaRows: 1,
            					enableAttachments: false,
            					
                                enableEditing: false,
    
            					getComments: function(success, error) {
            					    //alert(data);
            					    success(data);
            							
            						},
            					postComment: function(data, success, error) {
            					   
            					    data.created= new Date();
            					     //alert(JSON.stringify(data));
            						setTimeout(function() {
            							
                                    var saveurl=commentSaveUrl + options.id;
                                    saveurl +="/" + data.parent;
                                   // saveurl +="/" + "navs";
                                    saveurl +="/" + data.content;
                                   // console.log(saveurl);
                                    //getJsonDataAsync(saveurl,{storyId:Id,username:'navs',comments:data.content},function(er){
                                    util.getJsonDataAsync(saveurl,null,function(er){    
                                    
                                        //alert('error');
                                        $(options.diverr).html('<span style="color:red">' + er +'</span>');
                                        
                                    },function(data) {
                                        //alert('error - 2');
                                        if (data.errorMessage != undefined || data.errorMessage != null) {
                                           // alert(options.diverr);
                                            //alert(data.errorMessage);
                                            //$(divError).val(data.errorMessage);
                                             $(options.diverr).html('<span style="color:red">' + data.errorMessage +'</span>');
                                           //cberror(data.errorMessage);
                                            
                                        }
                                        else
                                        {
                                             //alert(options.id);
                                             util.getGalleryImageomments(options);
                                             //success(data);
                                             cb(null,options);
                                             //refresh();
                                        }
                                        
                                        
                                    });
                                    
            						}, 500);
            					},
            					putComment: function(data, success, error) {
            						setTimeout(function() {
            							
            							//alert(3);
            						}, 500);
            					},
            					deleteComment: function(data, success, error) {
            						setTimeout(function() {
            							//success();
            						//	alert(data);
            							$(options.diverr).html('<span style="color:red">' + data +'</span>');
            							
            						}, 500);
            					},
            					upvoteComment: function(data, success, error) {
            						setTimeout(function() {
            						    console.log(JSON.stringify(data));
            							//success(data);
            							//alert(JSON.stringify(data));
            							
                                        var saveurl=commentLikeSaveUrl + data.id;
                                        
                                        saveurl +="/" + "navs";
                                        
                                       console.log(saveurl);
                                        
                                        util.getJsonDataAsync(saveurl,null,function(er){    
                                        
                                        
                                        },function(data) {
                                        
                                        util.getGalleryImageomments(options);
                                        
                                        
                                        });
            							
            						}, 500);
            					},
            					uploadAttachments: function(dataArray, success, error) {
            						setTimeout(function() {
            							//success(dataArray);
            							//alert(data);
            							
            						}, 500);
            					},
            					
            					refresh: function() {
            					   
                                            $(div).addClass('rendered');
                                        }
            				});
        });
    }
    
    ,configureComments:function(
        options,cb
        ){
        
       var defaults= {
        commentGetUrl:'/api/gallery/getComments/' ,
        commentSaveUrl:'/api/gallery/SaveComments/',
        commentLikeSaveUrl:'/api/gallery/UpVoteComment/',
        div:'#divComment',
        diverr:'#divError'
    }
    var config = $.extend({}, defaults, options);
    //alert(JSON.stringify(config));
    
        config.commentGetUrl=config.commentGetUrl + config.Id; ;
       //config.commentSaveUrl=config.commentSaveUrl;
        //config.commentLikeSaveUrl='/api/gallery/UpVoteComment/';
       // alert(options.id);
        //var url='/api/StoryComments/'+options.id;
        config.div=config.div  + config.Id;
        //alert(JSON.stringify(options));
        //alert(commentGetUrl);
        $(config.div).empty();
       
        util.getJsonDataAsync(config.commentGetUrl,null,function(er){
            //alert(commentGetUrl);
          
        },function(data){
           
                //alert(JSON.stringify(data));
                $(config.div).comments({
                    
            					//profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/user_profiles/user-icon.png',
            					roundProfilePictures: true,
            					textareaRows: 1,
            					enableAttachments: false,
            					
                                enableEditing: false,
    
            					getComments: function(success, error) {
            					    //alert(data);
            					    success(data);
            							
            						},
            					postComment: function(data, success, error) {
            					   
            					    data.created= new Date();
            					     //alert(JSON.stringify(data));
            						setTimeout(function() {
            							
                                    var saveurl=config.commentSaveUrl + options.id;
                                    saveurl +="/" + data.parent;
                                   // saveurl +="/" + "navs";
                                    saveurl +="/" + data.content;
                                   // console.log(saveurl);
                                    //getJsonDataAsync(saveurl,{storyId:Id,username:'navs',comments:data.content},function(er){
                                    util.getJsonDataAsync(saveurl,null,function(er){    
                                    
                                        //alert('error');
                                        $(config.diverr).html('<span style="color:red">' + er +'</span>');
                                        
                                    },function(data) {
                                        //alert('error - 2');
                                        if (data.errorMessage != undefined || data.errorMessage != null) {
                                           // alert(options.diverr);
                                            //alert(data.errorMessage);
                                            //$(divError).val(data.errorMessage);
                                             $(config.diverr).html('<span style="color:red">' + data.errorMessage +'</span>');
                                           //cberror(data.errorMessage);
                                            
                                        }
                                        else
                                        {
                                             //alert(options.id);
                                             util.getGalleryImageomments(options);
                                             //success(data);
                                             cb(null,options);
                                             //refresh();
                                        }
                                        
                                        
                                    });
                                    
            						}, 500);
            					},
            					putComment: function(data, success, error) {
            						setTimeout(function() {
            							
            							//alert(3);
            						}, 500);
            					},
            					deleteComment: function(data, success, error) {
            						setTimeout(function() {
            							//success();
            						//	alert(data);
            							$(config.diverr).html('<span style="color:red">' + data +'</span>');
            							
            						}, 500);
            					},
            					upvoteComment: function(data, success, error) {
            						setTimeout(function() {
            						    console.log(JSON.stringify(data));
            							//success(data);
            							//alert(JSON.stringify(data));
            							
                                        var saveurl=config.commentLikeSaveUrl + data.id;
                                        
                                        saveurl +="/" + "navs";
                                        
                                       console.log(saveurl);
                                        
                                        util.getJsonDataAsync(saveurl,null,function(er){    
                                        
                                        
                                        },function(data) {
                                        
                                        util.getGalleryImageomments(config);
                                        
                                        
                                        });
            							
            						}, 500);
            					},
            					uploadAttachments: function(dataArray, success, error) {
            						setTimeout(function() {
            							//success(dataArray);
            							//alert(data);
            							
            						}, 500);
            					},
            					
            					refresh: function() {
            					   
                                            $(config.div).addClass('rendered');
                                        }
            				});
        });
    
    
    
}

    ,helloWorld:function(){
        alert('hello world');
        
    }
}
})();