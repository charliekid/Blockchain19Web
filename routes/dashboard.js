var express = require('express');
var router = express.Router();
const http = require('http');
var axios = require('axios');


/************************************************************************************************
 *                          GET/POST/PUT/CREATE etc
 ************************************************************************************************/

/* GET users listing. */
router.get('/', function(req, res, next) {

    req.session.username = 'Patient1';
    var data;
    var transactionData;
    var json;

    http.get("http://localhost:10050/transaction/list/"+req.session.username, (resp) => {
        resp.on("data", (information) => {
            data += information;
        });
        resp.on("end", () => {
            try {
                //console.log("data length = [" + data.length + "]");
                var substring = data.substr(9, data.length);
                substring = substring.replaceAll("@", "");
                console.log("\nsubstring = " + substring);
                json = JSON.parse(substring);

                // checks to see if we got any data or not.
                var key, count = 0;
                for(key in json.data) {
                    if(json.data.hasOwnProperty(key)) {
                        count++;
                    }
                }
                console.log("count :" + count);
                console.log(json.data);
                console.log("first name is :" + json.data[0].state.data.firstName);
                let transactionData = {
                    numOfTransaction : count,

                }
                // which means we got no transactions
                // if(count == 0 ) {
                //     res.render('dashboard', {transaction : json, PartyName: req.session.username});
                // } else {
                //     res.render('dashboard', {transaction : json, PartyName: req.session.username});
                // }
                // console.log(json.data);
                // console.log(json.data[0].state);
                // console.log(json.data[0].state.data);
                // console.log("data: " + json.data.size);
                // try{
                //     transactionData = json.data[0].state.data;
                // } catch (err) {
                // means there isn't any data
                // }

                res.render('dashboard', {transactions : json.data, PartyName: req.session.username});
                // res.render('dashboard', {PartyName : req.session.username,
                //                             firstName:json.data[0].state.data.firstName,
                //                             lastName:json.data[0].state.data.lastName,
                //                             dose:json.data[0].state.data.dose
                //
                // });

            } catch (error) {
                console.error(error);
                console.error("error within dashboard.js/get/http.get/resp.on(end)");
            };
            //console.log(data);

        });

    });
    // http.get("http://localhost:10050/transaction/list/"+req.session.username, (resp) => {
    //     resp.on("data", (information) => {
    //         data += information;
    //     });
    //     resp.on("end", () => {
    //         try {
    //             //console.log("data length = [" + data.length + "]");
    //             var substring = data.substr(9, data.length);
    //             substring = substring.replaceAll("@", "");
    //             console.log("\nsubstring = " + substring);
    //             json = JSON.parse(substring);
    //
    //             // checks to see if we got any data or not.
    //             var key, count = 0;
    //             for(key in json.data) {
    //                 if(json.data.hasOwnProperty(key)) {
    //                     count++;
    //                 }
    //             }
    //             console.log("count :" + count);
    //             console.log(json);
    //             // which means we got no transactions
    //             if(count == 0 ) {
    //
    //             } else {
    //
    //             }
    //             // console.log(json.data);
    //             // console.log(json.data[0].state);
    //             // console.log(json.data[0].state.data);
    //             // console.log("data: " + json.data.size);
    //             // try{
    //             //     transactionData = json.data[0].state.data;
    //             // } catch (err) {
    //                 // means there isn't any data
    //             // }
    //
    //             res.render('dashboard', {transaction : json});
    //             // res.render('dashboard', {PartyName : req.session.username,
    //             //                             firstName:json.data[0].state.data.firstName,
    //             //                             lastName:json.data[0].state.data.lastName,
    //             //                             dose:json.data[0].state.data.dose
    //             //
    //             // });
    //
    //         } catch (error) {
    //             console.error(error);
    //             console.error("error within dashboard.js/get/http.get/resp.on(end)");
    //         };
    //         //console.log(data);
    //
    //     });
    //
    // });

});

/************************************************************************************************
 *                          FUNCTIONS/METHODS
 ************************************************************************************************/


module.exports = router;
