(function(mailer)
{

var nodemailer = require('nodemailer');
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL 
    auth: {
        user: 'mykathua@gmail.com',
        pass: 'London01'
    }
};

mailer.sendEmail = function(){
 
// create reusable transporter object using the default SMTP transport 
var transporter = nodemailer.createTransport("smtp",smtpConfig);
 
// setup e-mail data with unicode symbols 
var mailOptions = {
    from: '"naveen sharma" <mykathua@gmail.com>', // sender address 
    to: 'navs@hotmail.co.uk', // list of receivers 
    subject: 'Hello', // Subject line 
    text: 'Hello world', // plaintext body 
    html: '<b>Hello world</b>' // html body 
};
 
// send mail with defined transport object 

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});

}
}
)(module.exports);  

