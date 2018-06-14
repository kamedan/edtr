var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);

router.route('/')
.get( function(req, res, next) {
  res.render('contact', { title: 'EDTR' });
})
.post( function(req, res, next) {

    req.checkBody('name', 'Emty name').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('message', 'Emty message').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('contact', { 
            title: 'EDTR', 
            name : req.body.name, 
            email: req.body.email, 
            message: req.body.message, 
            errorMessages : errors 
        });
    }else{

        var mailOptions = {
            from: 'edtr <not-reply@medfkefe.com>',
            to: config.mailer.auth.user,
            subject: 'You got new message from  visitor',
            text: 'An email from ' + req.body.email + ', Message : '+ req.body.message
        };

        transporter.sendMail(mailOptions, function(err, info){
            if( err){
                return console.log(err)
            }else{
                res.render('thank', { title: 'EDTR' });
            }
        })
        
    }
    

    
  });

module.exports = router;
