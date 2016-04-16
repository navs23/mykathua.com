
function searliseJsonIntoHtmlTable(jsonData) {
    
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
};

var getJsonData = function (url, data) {

    
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

};

var getJsonDataAsync = function (url, options,errorCb, successCb) {

    $.ajax({
        async: false,
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
 };


var showHideComment= function(storyId){
    alert(storyId);
   getStoryComments(storyId);
   $('#divComment' + storyId).toggle();
 
}
var getStoryComments = function(options,cberror,cbsuccess)
{
    
    var url='/api/StoryComments/'+options.id;;
    var div='#divComment' +options.id;
    
    $(div).empty();
   
    getJsonDataAsync(url,{storyId:options.id},function(er){
        
      
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
        							
                                var saveurl='/api/SaveComments/' + options.id;
                                saveurl +="/" + data.parent;
                               // saveurl +="/" + "navs";
                                saveurl +="/" + data.content;
                               // console.log(saveurl);
                                //getJsonDataAsync(saveurl,{storyId:Id,username:'navs',comments:data.content},function(er){
                                getJsonDataAsync(saveurl,null,function(er){    
                                
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
                                         getStoryComments(options.id);
                                         cbsuccess(data);
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
                                    
                                    getJsonDataAsync(saveurl,null,function(er){    
                                    
                                    
                                    },function(data) {
                                    
                                    getStoryComments(options.id);
                                    
                                    
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