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

/**
 * Gets the dashboard home page for Patient accounts. This method also uses an http.get() in order
 * to retrieve the patient's transaction from the Corda Nodes.
 */
router.get('/patient', function(req, res, next) {

    var data;
    var json;

    // Getting the list of patient transactions
    http.get("http://localhost:10050/transaction/list/"+req.session.username, (resp) => {
        resp.on("data", (information) => {
            data += information;
        });
        resp.on("end", () => {
            try {
                // Data comes in weirdly so adjusting the string so that we can
                // store it into a json file
                var substring = data.substr(9, data.length);
                substring = substring.replaceAll("@", "");
                json = JSON.parse(substring);

                // checks to see if we got any data or not.
                var key, count = 0;
                for(key in json.data) {
                    if(json.data.hasOwnProperty(key)) {
                        count++;
                    }
                }

                // Render the page
                res.render('dashboards/patient-dashboard', {
                    transactions : json.data,
                    PartyName: req.session.username});

            } catch (error) {
                console.error(error);
                console.error("error within dashboard.js/get/http.get/resp.on(end)");
            };

        });
    });
});

/************************************************************************************************
 *                          Doctor
 ************************************************************************************************/
/**
 * Gets the dashboard home page for Doctor account. This method also uses an http.get() in order
 * to retrieve the doctor's transaction from the Corda Nodes.
 */
router.get('/doctor', function(req, res, next) {
    var data;
    var json;

    // Getting the list of doctor transactions
    http.get("http://localhost:10050/transaction/list/"+req.session.username, (resp) => {
        resp.on("data", (information) => {
            data += information;
        });
        resp.on("end", () => {
            try {
                // Data comes in weirdly so adjusting the string so that we can
                // store it into a json file
                var substring = data.substr(9, data.length);
                substring = substring.replaceAll("@", "");
                json = JSON.parse(substring);

                // checks to see if we got any data or not.
                var key, count = 0;
                for(key in json.data) {
                    if(json.data.hasOwnProperty(key)) {
                        count++;
                    }
                }

                // Render the page
                res.render('dashboards/doctor-dashboard', {
                    transactions : json.data,
                    PartyName: req.session.username});

            } catch (error) {
                console.error(error);
                console.error("error within dashboard.js/get/http.get/resp.on(end)");
            };
        });
    });
});

/**
 * This will communicate with the Controller on the Corda Java project. This will submit a patient's information
 * for approval.
 */
router.get('/approvePatient/:firstName/:lastName', function(req, res, next) {
    var firstName = req.params.firstName;
    var lastName = req.params.lastName;

    axios.post('http://localhost:10050/approvePatient', {},
        {params: {
            firstName: firstName,
            lastName: lastName,
            username: req.session.username
        }})
        //Server  successful response
        .then((response) => {
            res.redirect('/dashboard');
        })
});


/************************************************************************************************
 *                          Clinic
 ************************************************************************************************/
/**
 * Gets the dashboard home page for Clinic accounts. This method also uses an http.get() in order
 * to retrieve the clnic's transaction from the Corda Nodes.
 */
router.get('/clinic', function(req,res,next){
    var data;
    var json;

    // Getting the list of ClinicAdmin transactions
    http.get("http://localhost:10050/transaction/list/"+req.session.username,(resp)=>{
        resp.on("data", (information) => {
            data += information;
        });
        resp.on("end", ()=>{
            try{
              // Data comes in weirdly so adjusting the string so that we can
              // store it into a json file
                var substring = data.substr(9, data.length);
                substring = substring.replaceAll("@", "");
                json = JSON.parse(substring);

            res.render('dashboards/clinic-dashboard', {
                transactions : json.data,
                PartyName: req.session.username});
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
/**
 * Gets the dashboard home page for employer accounts. This method also uses an http.get() in order
 * to retrieve the employer's transaction from the Corda Nodes.
 */
router.get('/employer', function(req,res,next){

    var data;
    var json;

    // Getting the list of patients transactions
    http.get("http://localhost:10050/transaction/list/"+req.session.username,(resp)=>{
        resp.on("data", (information) => {
            data += information;
        });
        resp.on("end", ()=>{
            try{
                // Data comes in weirdly so adjusting the string so that we can
                // store it into a json file
                var substring = data.substr(9, data.length);
                substring = substring.replaceAll("@", "");
                json = JSON.parse(substring);

                res.render('dashboards/employer-dashboard', {
                    transactions : json.data,
                    PartyName: req.session.username});
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
