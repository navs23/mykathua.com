(function(otherController){
    
    var cheerio = require('cheerio');
    var dex =require("../helper");
    var dal =require("../sql");
    var async = require("async");
    const cacheMiddleware = require("../middleware/cache");
    let cacheExpiryTime = process.env.cache_expiry_time || 300;
    otherController.init= function(app){
        
     app.get("/trainstatus/",function(req,res){
       var railwayServicesHTML='';
       
       var links=[
  {
    "href": "http://www.indianrail.gov.in/MobileTicketing.html",
    "text": "Mobile Ticketing Services"
  },
  {
    "href": "http://www.indianrail.gov.in/FullTrafficRate.html",
    "text": "Registration of Train/Coach on Full Tariff Rate(FTR)"
  },
 
  {
    "href": "http://www.indianrail.gov.in/train_Schedule.html",
    "text": "Reserved Train Schedule"
  },
  {
    "href": "http://www.indianrail.gov.in/sms_Service.html",
    "text": "SMS Service"
  },
  {
    "href": "http://www.indianrail.gov.in/inet_curbkg_Enq.html",
    "text": "Current Booking Availability"
  },
  {
    "href": "http://www.indianrail.gov.in/dont_Know_Station_Code.html",
    "text": "Train Berth Availability "
  },
  {
    "href": "http://www.indianrail.gov.in/http://www.indianrail.gov.in/CateringCharge.html",
    "text": "Catering Charges"
  },
  
  {
    "href": "http://www.indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,537",
    "text": "Trains at a Glance "
  },
  {
    "href": "http://www.indianrail.gov.in/international_Tourist.html",
    "text": "International Tourists"
  },
  {
    "href": "http://www.indianrail.gov.in/tatkal_Scheme.html",
    "text": "Tatkal Scheme"
  },
  {
    "href": "http://www.indianrail.gov.in/other_Rly_Sites.html",
    "text": "Other Railway Websites"
  }
];
       
       
       var url='http://www.railwayapi.com/getLiveTrains.php';
        dex.scrapePost(url,{'pnrQ':'KTHU','dest':2},function(html){
            
            var tBody='';
            var $=cheerio.load(html);
            var tHead='';
            var temp='';
         
            // header
             $('table thead').find('tr').each(function(i,e){
              
                temp='';
               $(e).find('th').each(function(j,c){
                   temp +='<th>' + $(c).text(); + '</th>';
                   
               });
              tHead = '<tr class="btn-primary">' + temp + '</tr>';
              
           });
           
            // body
           // temp='';
            tBody='';
           $('table tbody').find('tr').each(function(i,e){
            
               temp='';
               $(e).find('td').each(function(j,c){
                var ctext=$(c).text();
             
                  if (ctext =="RT")
                   temp +='<td class="btn-success">' + $(c).text() + '</td>';
                   else
                    temp +='<td>' + $(c).text() + '</td>';
                    
               
                });
              tBody +='<tr>' + temp + '</tr>';
             // console.log(tempBody);
              
           });
            temp='<table class="table" ><thead>' +tHead +'</thead><tbody>'  + tBody +  '</tbody></table>'
              res.render('other/trainstatus',{trainstatus:temp,user:req.user,links:links});
             
           
        });
        });
        
     // direcotry listing
     app.get("/directory/",cacheMiddleware(cacheExpiryTime),function(req,res,next){
     try{
         var url='https://kathua.nic.in/about-district/whos-who/';
         console.log(url);
         
         dex.scrape(url,function(html){
        
          var $=cheerio.load(html);
          var contacts=[];   
          var contact={};
         $('div.tb_content').each(function(i,e){
          // console.log($(e).html());
             $(e).find('tbody tr').each(function(i,e){
              contact={}
                 $(e).find('td').each(function(i,cell){
                    if (i==0)
                    contact.name = $(cell).html();
                    if (i==1)
                    contact.designation = $(cell).html();
                    if (i==2)
                    contact.address = $(cell).html();
                    if (i==3)
                    contact.phone = $(cell).html();
                    
 
                 })
                contacts.push(contact);
             
             
              });
         
          });
          //console.log(contacts);
         res.render('other/directory',{data:contacts,user:req.user});
         });
     }catch(err){
      return next();
     }
    });
    
    //https://www.freshersworld.com/jobs/category/Govt-Sector-job-vacancies
    
   
   
   
    app.get("/executesql/",function(req,res){
     //req.app.get("joblinks").push({jobid:1,joblik:'http://jobid/1'});
     res.send(req.app.get("joblinks"));
   /* 
    dal.executeSql(null,function(){
      res.send("done");
     
    },function (err) {
     // body...
     res.send(err);
    })
    */
    }); 
     app.get("/api/railway/links",function(req,res){
      raliwayLinks(function(links){
       res.send(links);
       
      },function(err){
       
       res.send(err);
      });
   
   
    
    });
    


    
var raliwayLinks=function(cb,cberr){
var links=[];
var railwayServicesHTML='';

        var url='http://www.indianrail.gov.in/';
        var temp='';
          dex.scrape(url,function(html){
          // console.log(html);
          var link={};
            var $=cheerio.load(html);
            $('body').find('td.link-main-menu').each(function(i,e){
             
             link={};
             link.href=url+$(e).find('a').attr('href');
             link.text=$(e).find('a').text();
             links.push(link);
            
             
            });
          // console.log(temp);
           cb(links);
       
        
           
          },function(err){
           console.log('error');
           cberr(err);
          });
}
     
    }
    
})(module.exports);
