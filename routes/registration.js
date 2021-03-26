var express = require('express');
var router = express.Router();

var crypto = require('crypto');

var authTokens = {};

function getHashedPassword(password) {
 var sha256 = crypto.createHash('sha256');
 var hash = sha256.update(password).digest('base64');
 return hash;
}
function createAuthToken(){
    return crypto.randomBytes(30).toString('hex');
}

router.get('/', function(req,res,next){
    res.render('registration');
});


router.post('/',function(req,res,next){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var password = req.body.password1;
    var passwordConfirmed = req.body.password2;

    var hashedPassword = getHashedPassword(password);
    var hashedConfirmedPW = getHashedPassword(passwordConfirmed);

    //TODO: Check Password match
    if(hashedPassword != hashedConfirmedPW){
        console.log("Passwords don't match");
//        res.render('/registration', {
//            message: 'Passwords do not match',
//            messageClass: 'alert-danger'
//        });
        //res.redirect('/registration');
        return;
    }
    else {
    //TODO: Send data

        res.redirect('/login');
    }


    /* console.log(firstName);
    console.log(lastName);
    console.log(hashedPassword);
    console.log(hashedConfirmedPW); */


});

module.exports = router;
