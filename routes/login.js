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

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login');
});


router.post('/', async function(req, res, next) {
    let successful = false;
    let message = '';
    hashedUsername = hashSha256(req.body.username);
    hashedPassword = hashSha256(req.body.password);
    let dbResult = await verifyLogin(hashedUsername, hashedPassword, req.body.accountTypeSelection);
    // this means we got some data
    if(dbResult != null) {
        console.log("dbresult:" + dbResult);
        req.session.username = dbResult;
        res.redirect('/dashboard');
    } else {
        console.log("inccorect log in");
        // TODO : redirect to log in page saying that password and username is incorrect
        res.redirect('/login');
        //alert("Incorrect username or password");
    }

});


/************************************************************************************************
 *                          FUNCTIONS/METHODS
 ************************************************************************************************/

/**
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

//function logout(){
//
//}

/**
 * Used to verify user login information against a specifed database.
 *  Created by Charlie
 * @param hashedUsername
 * @param hashedPassword
 * @param partyType
 * @returns the Party's unique id if the SQL query is sucessful. Otherwise it will return null.
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
