
    (function(newsscraper){
        let axios = require('axios');
        let https = require('https');
        let fs = require('fs'); 
        // At instance level
        const instance = axios.create({
            httpsAgent: new https.Agent({  
            rejectUnauthorized: false
            })
        });
        
        newsscraper.scrapeNews=(newsurl)=>{

           return new Promise(function(resolve, reject) {
            newsStorage=[];
          
 
         
         instance.get(newsurl)
                .then((response) => {
                    if(response.status === 200) {
                        const html = response.data;
                   
                          return resolve(html);
                  
                }
                }, (error) => {
                    console.log(error);
                    reject(error);
                }

               );
              
              });
              
             

           
            
                
             
        }
       
    })(module.exports)
