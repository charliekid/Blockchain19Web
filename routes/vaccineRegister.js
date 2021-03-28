var express = require('express');
var http = require('https');
var router = express.Router();


router.get('/', function(req,res,next){
    res.render('vaccineRegister');
});

router.post('/', function(req,res,next){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var doses = 0;

    //TODO: Find better way to check user info and send dat to Spring controller"
    if(firstName == "John" && lastName == "Doe"){

        //http.post request goes here
        http.post("http://localhost:10050/api/registerVaccine", function(req,res){
            res.send(firstName);
        });
        doses = doses + 1;
        res.redirect('/dashboard');
        //console.log("registered for first dose!");
        //console.log('Dose: ' + doses);
        return;
    }
    else{
        res.render('vaccineRegister',{
            message: "There was a problem with your registration, please try again",
            messageClass: 'alert-danger'
        });
    }

});


module.exports = router;
