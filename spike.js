var emailHelper = require('./helper/mail.js');
emailHelper.sendEmail(
        {
            from: 'do-not-reply@mykathua.com',
            to: 'navs@hotmail.co.uk',
            subject: 'mykathua.com->registeration, email confirmation',
            html: "Hello Naveen" +  ",<p>Thank you for registering at mykathua.com, please click on the below link to complete your registration<br/><br/><br/><a href='" + process.env.BASE_WEBSITE_URL  + "'>click here to complete your registeration</a></p><br/><p>Thanks, <a href='http://wwww.mykathua.com'>Mykathua.com</a> team</p>"
       
            
        });