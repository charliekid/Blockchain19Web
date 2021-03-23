var express = require('express');
var router = express.Router();
const http = require('http');
const axios = require('axios')
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/', function(req, res, next) {
    let successful = false;
    let message = '';

    // TODO figure out how we are gonna save usernames and stuff
    if (req.body.username === 'user1' && req.body.password === 'test') {

        successful = true;

        // Lets the the actual Node party name from Corda
        // http.get("http://localhost:10050/getPartyName", (resp) => {
        //     resp.on("data", (information) => {
        //         req.session.username = data;    // saving party name so we can reference later
        //     });
        //     resp.on("end", () => {
        //         console.log(data);
        //     });
        // });
        req.session.username = req.body.username;
        // req.cookie('jason', 'the great!', { maxAge: 900000, httpOnly: true });
        res.redirect('/dashboard');
    }
    else {
        // delete the user as punishment
        delete req.session.username;
        message = 'Wrong username or password!'
        // TODO redirect back to log in page noting that username or password is incorrect

    }
    // const options = {
    //     url: 'http://localhost:10050/checkUserName',
    //     json: true,
    //     body: {
    //         username: req.body.username,
    //         paswword: req.body.password,
    //         accountType: req.body.accountTypeSelection
    //     }
    // }
    // request.post(options, (err, res, body) => {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     console.log(`Status: ${res.statusCode}`);
    //     console.log(body);
    // });
    // request.post( 'http://localhost:10050/checkUserName',
    //     { json: {
    //             username: req.body.username,
    //             paswword: req.body.password,
    //             accountType: req.body.accountTypeSelection
    //              } },
    //     function (error, response, body) {
    //         if (!error && response.statusCode == 200) {
    //             console.log(body);
    //         }
    //     }
    // );
    // const loginInfo = {
    //         username: req.body.username,
    //         paswword: req.body.password,
    //         accountType: req.body.accountTypeSelection
    // }
    // axios.post(
    //     'http://localhost:10050/postmethod',
    //     loginInfo)
    //     .then((res) => {
    //         console.log(`Status: ${res.status}`);
    //         console.log('Body: ', res.data);
    //     }).catch((err) => {
    //     console.error(err);
    // });

        // if (gameId !== null) {
        //     const secret_msg = "❄️ The elves 🧝‍♂️ have set aside some space " + gameId + " in santa's workshop! ❄️";
        //     console.log(secret_msg);
        //
        //     if (!SEND_EMAIL) {
        //         alert(secret_msg);
        //     }
        //
        //     setResponse(res);
        // }




    // console.log("username: " + req.session.username);
// 'http://localhost:10050/checkUserName'




        // axios
    //     .post('http://localhost:10050/checkUserName', {
    //         username: req.body.username,
    //         paswword: req.body.password,
    //         accountType: req.body.accountTypeSelection
    //     })
    //     .then((res) => {
    //         // console.log(`statusCode: ${res.statusCode}`)
    //         // console.log(res)
    //     })
    //     .catch((error) => {
    //         console.error(error)
    //     })


    // Return success or failure
    // res.json({
    //     successful: successful,
    //     message: message
    // });

    //res.render('login');
});


module.exports = router;
