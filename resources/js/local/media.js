

var dislayStory=function(Id)
{
    var url='/api/getStory/';
    var data=getJsonData( url,{storyId:Id});
    
   // alert(JSON.stringify(data));
}


var showHideStory= function(storyId){
    //alert(storyId);
   // $('#divStory' + storyId).toggle();
}

var displayStrories= function(){
      $('#divContent').append($('<table class="table"><tbody></tbody></table>'));
            
     
        var data=getJsonData('/api/stories/',{storyId:0,showOnHomePage:0});
        
        $(data).each(function(i){
       
            $('#divContent >table > tbody:first').append('<tr class="table-heading-row"><td><b>' + data[i].Title + '</b>, Published By <i>' + data[i].PostedBy + '&nbsp;</i><a href="#" onclick="showHideStory('+ data[i].StoryId + ')">[Read Story]</a>|<a href="#" onclick = "showHideComment(' + data[i].StoryId + ');">Show Comment</a></td></tr>'); 
            $('#divContent >table > tbody').append('<tr class="tr-story"><td><div class="div-story" id="divStory' + data[i].StoryId + '">' + data[i].Content + '</div></td></tr>'); 
           $('#divContent >table > tbody:first').append('<tr><td><div class="div-comments" id="divComment' + data[i].StoryId + '">Comments</div></td></tr>'); 
        });
        
        
}

var templating = function (data) {
            var temp = '{{avatar}} {{user_name}}{{screen_name}}- {{date}} - {{tweet}}';
            var temp_variables = ['date', 'tweet', 'avatar', 'url', 'retweeted', 'screen_name', 'user_name'];

            for (var i = 0, len = temp_variables.length; i < len; i++) {
                temp = temp.replace(new RegExp('{{' + temp_variables[i] + '}}', 'gi'), data[temp_variables[i]]);
            }

            return temp;
        };

var linking = function (tweet) {
            var twit = tweet.replace(/(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig,'<a href="$1" target="_blank" title="Visit this link">$1</a>')
                 .replace(/#([a-zA-Z0-9_]+)/g,'<a href="http://twitter.com/search?q=%23$1&amp;src=hash" target="_blank" title="Search for #$1">#$1</a>')
                 .replace(/@([a-zA-Z0-9_]+)/g,'<a href="http://twitter.com/$1" target="_blank" title="$1 on Twitter">@$1</a>');

            return twit;
        };
        
var dating = function (twt_date) {
            // fix for IE
            var time = twt_date.split(' ');
            twt_date = new Date(Date.parse(time[1] + ' ' + time[2] + ', ' + time[5] + ' ' + time[3] + ' UTC'));

            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            var _date = {
                '%d': twt_date.getDate(),
                '%m': twt_date.getMonth()+1,
                '%b': months[twt_date.getMonth()].substr(0, 3),
                '%B': months[twt_date.getMonth()],
                '%y': String(twt_date.getFullYear()).slice(-2),
                '%Y': twt_date.getFullYear()
            };

            var date = '%b/%d/%Y';
            var format = date.match(/%[dmbByY]/g);

            for (var i = 0, len = format.length; i < len; i++) {
                date = date.replace(format[i], _date[format[i]]);
            }

            return date;
        };
// get tweets
var displayTweets= function(e){
    
        var temp='';
        var tweet,temp_data;
        getJsonDataAsync('/api/getTweets/',null,function(){},function(data){
            //alert(1);
             $(data.statuses).each(function(i){
                
                  temp ='';        
                  tweet=data.statuses[i];
                  temp_data = {
                                user_name: tweet.user.name,
                                date: dating(tweet.created_at),
                                tweet: (tweet.retweeted) ? linking('RT @'+ tweet.user.screen_name +': '+ tweet.retweeted_status.text) : linking(tweet.text),
                                avatar: '<img src="'+ tweet.user.profile_image_url +'" />',
                                url: 'http://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                                retweeted: tweet.retweeted,
                                screen_name: linking('@'+ tweet.user.screen_name)
                            };
        
                            temp ='<li class="tweet">' + templating(temp_data) + '</li>';
                            ////alert(temp);
                            $(e).append(temp);
                });
        });
        
       
       // $('#divTweets').html('<ul>' + html + '</ul>');
        
}
/*
var displayNews=function(url,div){
    
    var html='<table class="table" border="0"><tbody>'
  
   var item='';
   var temp='';
    var data=getJsonData( url,null);
   // alert(data);
    $(data).each(function(i){
        item='';
        item='<td style="width:70px;"><a href="' + data[i].link + '" target="_new"><img src=' +  data[i].thumbnail + ' style="width:70px;height:70px"/></a></td>';
        item+='<td>' + data[i].description.trim() +'<span><a href="' + data[i].link +'" target="_new">read more</a></span></td>';
       
       temp +='<tr style="height:150px;padding-top:0px;">' + item + '</tr>';
    });
  
  html +=temp +'</tbody></table>';
  $(div).html(html);
}
*/
var displayNews=(url,div)=>{
    
   // var html='<table class="table" border="0"><tbody>'
  
   var item='';
   var temp='';
    var data=getJsonData( url,null);
   // alert(data);
    $(data).each(function(i){
        
        item='';
        item='<div class="col-md-5"><a href="' + data[i].link + '" target="_new"><img height="50" width="50" class ="img-thumbnail text-center" style="vertical-align:middle;" src="' +  data[i].thumbnail + '"/></a>';
        item+='<span class="text-small">' + data[i].description.trim() +'<a href="' + data[i].link +'" target="_new">read more</a><span></div>';
        temp +='<div class="row">' + item + '</div>';
        
    });
  
//  html +=temp +'</tbody></table>';
  $(div).html(temp);
}