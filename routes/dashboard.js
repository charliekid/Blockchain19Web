var express = require('express');
var router = express.Router();
const http = require('http');
var axios = require('axios');


/************************************************************************************************
 *                          GET/POST/PUT/CREATE etc
 ************************************************************************************************/

/* GET users listing. */
router.get('/', function(req, res, next) {

    if(req.session.username === 'Patient1') {
        res.redirect('/dashboard/patient');
    } else if (req.session.username == 'Doctor1') {
        res.redirect('/dashboard/doctor');
    } else if (req.session.username == 'ClinicAdmin1') {
        res.redirect('/dashboard/clinic');
    } else if (req.session.username == 'Employer1') {
        res.redirect('/dashboard/employer');
    }

});

/************************************************************************************************
 *                          Patient
 ************************************************************************************************/

router.get('/patient', function(req, res, next) {
    // req.session.username = 'Patient1';
    var data;
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
                // console.log("first name is :" + json.data[0].state.data.firstName);


                res.render('dashboards/patient-dashboard', {transactions : json.data, PartyName: req.session.username});
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
});

/************************************************************************************************
 *                          Doctor
 ************************************************************************************************/

router.get('/doctor', function(req, res, next) {
    req.session.username = 'Doctor1';

    var data;
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


                res.render('dashboards/doctor-dashboard', {transactions : json.data, PartyName: req.session.username});
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
});

router.get('/approvePatient/:firstName/:lastName', function(req, res, next) {
    var firstName = req.params.firstName;
    var lastName = req.params.lastName;
    console.log(`insde of /approvePatient/${firstName}/${lastName}`);

    axios.post('http://localhost:10050/approvePatient', {},
        {params: {
            firstName: firstName,
            lastName: lastName,
            username: req.session.username
        }})
        //Server  successful response
        .then((response) => {
            //console.log("inside axios post call");
            //console.log(response[0].data);

            console.log(response);

            //console.log(req.session.username);
            res.redirect('/dashboard');
        })






});


/************************************************************************************************
 *                          Clinic
 ************************************************************************************************/

router.get('/clinic', function(req,res,next){
   // req.session.username = 'Clinic1';
    var data;
    var json;
    http.get("http://localhost:10050/transaction/list/"+req.session.username,(resp)=>{
        resp.on("data", (information) => {
          data += information;
        });
        resp.on("end", ()=>{
          try{
            var substring = data.substr(9, data.length);
            substring = substring.replaceAll("@", "");
            console.log("\nsubstring = " + substring);
            json = JSON.parse(substring);

            console.log(json.data);

            res.render('dashboards/clinic-dashboard', {transactions : json.data, PartyName: req.session.username});
          }
          catch(err){
            console.log(err);
          }

        });

    });

});

/************************************************************************************************
 *                          Employer
 ************************************************************************************************/

router.get('/employer', function(req,res,next){
   // req.session.username = 'Clinic1';
    var data;
    var json;
    http.get("http://localhost:10050/transaction/list/"+req.session.username,(resp)=>{
        resp.on("data", (information) => {
          data += information;
        });
        resp.on("end", ()=>{
          try{
            var substring = data.substr(9, data.length);
            substring = substring.replaceAll("@", "");
            console.log("\nsubstring = " + substring);
            json = JSON.parse(substring);

            console.log(json.data);

            res.render('dashboards/employer-dashboard', {transactions : json.data, PartyName: req.session.username});
          }
          catch(err){
            console.log(err);
          }

        });

    });

});



router.get('/logout', function(req,res,next) {
    req.session.destroy();
    res.redirect('/login');
});

/************************************************************************************************
 *                          FUNCTIONS/METHODS
 ************************************************************************************************/

module.exports = router;
