/*
* Created by Jorge
*/
var express = require('express');
var router = express.Router();

var crypto = require('crypto');

var authTokens = {};
/**
 * Created by Jorge
 * @param password
 * @returns {string}
 */
function getHashedPassword(password) {
 var sha256 = crypto.createHash('sha256');
 var hash = sha256.update(password).digest('base64');
 return hash;
}
/**
 * Created by Jorge
 * @returns {string}
 */
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

    if(hashedPassword == hashedConfirmedPW){
        res.redirect('/login');
        return;
    }
    else {

        res.render('registration',{
                    message: "Passwords don't match",
                    messageClass: 'alert-danger'
                });
        //res.redirect('/login');
    }

});

module.exports = router;
