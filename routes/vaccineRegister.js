var express = require('express');
var http = require('https');
var axios = require('axios');
var router = express.Router();



router.get('/', function(req,res,next){
    res.render('vaccineRegister');
});
/*
router.post('/', function(req,res,next){


    //TODO: Find better way to check user info and send dat to Spring controller"
    if(firstName == "John" && lastName == "Doe"){

        //http.post request goes here
        https.post("http://localhost:10050/api/registerVaccine", function(req,res){
            res.send(firstName);
            console.logO("Post request");
        });
        doses = doses + 1;
        res.redirect('/dashboard');
        console.log("post request sent");
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
*/
router.post('/', function(req,res,next){
    var first = req.body.firstName;
    var last = req.body.lastName;
    var dose = 0;

    var bodyFormData = new FormData;

    if(first == req.body.firstName && last == req.body.lasName){
            bodyFormData.append('firstName', first);
            bodyFormData.append('lastName', last);
            bodyFormData.append('dosage', dose);
            axios.post('')
    }






});





module.exports = router;
