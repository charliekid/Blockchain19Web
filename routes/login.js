var express = require('express');
var router = express.Router();
const http = require('http');
var request = require('request');
var axios = require('axios');
var crypto = require('crypto');
var authTokens = {};


/************************************************************************************************
 *                          GET/POST/PUT/CREATE etc
 ************************************************************************************************/

/**
 * Gets home login page
 */
router.get('/', function(req, res, next) {
    res.render('login');
});


/**
 * POST for login. This will grab the information inputted into the login form.
 * Then it will be hashed and verified through verifyLogin() function and passed back
 * to login.hbs. If the username does not exist in our database, it will return null
 * By Charlie Nguyen
 */
router.post('/', async function(req, res, next) {

    // Variables that will be passed back to login.hbs by the ajax call
    let successful = false;
    let message = '';

    // Variables so we can verify login information
    let hashedUsername = hashSha256(req.body.username);
    let hashedPassword = hashSha256(req.body.password);

    // We await a promise to be done
    let dbResult = await verifyLogin(hashedUsername, hashedPassword, req.body.accountTypeSelection);

    // Once we verify the login information, we will pass back to our ajax call the information needed
    if (dbResult != null) {
        successful = true;
        req.session.username = dbResult;
    }
    else {
        // delete the user as punishment!
        delete req.session.username;
        message = 'Wrong username or password!'
    }

    // Passing it back to the AJAX call in login.hbs
    res.json({
        successful: successful,
        message: message
    });


});
/************************************************************************************************
 *                          FUNCTIONS/METHODS
 ************************************************************************************************/

/**
 * TODO: JORGE create description
 * Created by Jorge
 * @param password
 * @returns {string}
 */
function getHashedPassword(password) {
    var sha256 = crypto.createHash('sha256');
    var hash = sha256.update(password).digest('hex');
    return hash;
}

/**
 * TODO: JORGE create description
 * Created by Jorge
 * @returns {string}
 */
function createAuthToken(){
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Wrapper function for Jorge created functions
 * Created by Charlie
 * @param stringToBeHashed - The string in which we want to has into sha-256
 * @returns {string} - the hashed value
 */
function hashSha256(stringToBeHashed) {
    hashed = getHashedPassword(stringToBeHashed);
    return hashed;
}



/**
 * Used to verify user login information against a speicifed database.
 *  Created by Charlie
 * @param hashedUsername
 * @param hashedPassword
 * @param partyType
 * @returns the Party's unique id if the SQL query is successful. Otherwise it will return null.
 */
function verifyLogin(hashedUsername, hashedPassword, partyType) {
    // Our SQL query we will use
    let query = 'SELECT partyid FROM Users_table WHERE username=? AND password=? AND partyType=?;';
    // The data that is being passed into the SQL query
    let data = [hashedUsername, hashedPassword, partyType]
    // Making a promise so that does this before continuing with the code.
    return new Promise(function(resolve, reject) {
        // Doing the actual DB query to get our result
        db.query(query, data, (err, result) => {
            if (err) {
                console.log("error" + err);
            } else if (result.length > 0) { // This means we got results back from our query
                 // console.log("partyid: " + result[0].partyid);
                // console.log("result length :" + result.length);
                resolve(result[0].partyid);
            } else { // This means we got zero results back from our query.
                return resolve(null);
            }
        })
    });
};

module.exports = router;
