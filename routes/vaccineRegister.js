var express = require('express');
var router = express.Router();

router.get('/', function(req,res,next){
    res.render('vaccineRegister');
});

router.post('/', function(req,res,next){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var doses = 0;
    //TODO: Find better way to check user info"
    if(firstName == "John" && lastName == "Doe"){
        doses = doses + 1;
        //Where user info goes for doctor approval
        res.redirect('/dashboard');
        console.log("registered for first dose!");
        console.log('Dose: ' + doses);
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
