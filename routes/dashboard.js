var express = require('express');
var router = express.Router();
const http = require('http');

/* GET users listing. */
router.get('/', function(req, res, next) {
    req.session.username = "user1"

    var data;
    var transactionData;
    var json;
    http.get("http://localhost:10050/transaction/list", (resp) => {
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
                console.log(json.data);
                console.log(json.data[0].state);
                console.log(json.data[0].state.data);
                transactionData = json.data[0].state.data;

                res.render('dashboard', {PartyName : req.session.username,
                                            firstName:json.data[0].state.data.firstName,
                                            lastName:json.data[0].state.data.lastName,
                                            dose:json.data[0].state.data.dose

                });

            } catch (error) {
                console.error(error);
                console.error("error within dashboard.js/get/http.get/resp.on(end)");
            };
            //console.log(data);

        });

    });



});

module.exports = router;
