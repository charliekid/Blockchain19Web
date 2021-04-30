/*
* Created by Jorge
*/
var express = require('express');
var router = express.Router();
var axios = require('axios');
const http = require('http');


router.get('/:firstName/:lastName', function(req, res, next) {

    let numberOfDose;   // used to see if patient has previous information to prefill our form
    let firstLot;
    let firstManufacturer;
    let firstDate;

    // Making a promise since we have to grab data from the last
    let myPromise = new Promise(function(myResolve, myReject)  {
        // Call the corda project to get the information
        http.get("http://localhost:10050/transaction/list/Patient1", (resp) => {
            var data;
            var json;
            var result;
            resp.on("data", (information) => {
                data += information;
            });
            resp.on("end", () => {
                try {
                    // Parsing data since there are extra values we dont need
                    var substring = data.substr(9, data.length);
                    substring = substring.replaceAll("@", "");
                    json = JSON.parse(substring);

                    numberOfDose = json.data[0].state.data.dose;

                    // The the info of the first vaccine
                    if(numberOfDose == 1) {
                        result = json.data[0].state.data.firstDoseDate;
                        firstDate = result.substr(0,10);
                        firstLot = json.data[0].state.data.firstDoseLot;
                        firstManufacturer = json.data[0].state.data.firstDoseManufacturer;
                        myResolve(numberOfDose);
                    }

                } catch (error) {
                    console.error(error);
                    console.error("error within clinicAdmin.js");
                    myReject("error");
                };
            });
        });
    });
    // Once we get the information needed we will render accordingly
    myPromise.then(
        function(value) {
            // If there is one dose already received.
            if(value > 0 ) {
                res.render('clinicAdmin',
                    {
                        firstName: req.params.firstName,
                        lastName: req.params.lastName,
                        firstDate: firstDate,
                        firstLot: firstLot
                    });
            // If there aren't any doses
            } else {
                res.render('clinicAdmin',
                    {
                        firstName: req.params.firstName,
                        lastName: req.params.lastName
                    });
            }
        },
        function(error) {
            console.log("We have an error in the myPromise in the get of clinicAdmin.js");
        }
    );
});

//Post request to send vaccine info to Spring controller
router.post('/', function(req,res,next){
    var data = req.body;
    var firstName = data.firstName;
    var lastName = data.lastName;
    var mfrName = data.mfrName;
    var dateOne = data.dateOne;
    var lotOne = data.lotNumberOne;
    var dateTwo = data.dateTwo;
    var lotTwo = data.lotNumberTwo;
    var doseNumber = data.doseNumberPicker;
    // var doseNumber = req.body.doseNumberPicker;
    //TODO: REMOVE THIS BELOW before deployment
    req.session.username = "ClinicAdmin1";

    // for dose number 1
    if(doseNumber == 1) {
        // @RequestHeader String firstName, @RequestHeader String lastName,@RequestHeader String mfrName,
        //                            @RequestHeader int doseNumber, @RequestHeader String dateVaccinated, @RequestHeader String lotNumber,
        //                            @RequestHeader String username
        //Axios post request
        axios.post('http://localhost:10050/clinicAdminFirstApproval', {},{
            headers: {  firstName: firstName,
                        lastName: lastName,
                        mfrName: mfrName,
                        doseNumber: doseNumber,
                        dateVaccinated: dateOne,
                        lotNumber: lotOne,
                        username: req.session.username
            },
            withCredentials: true

   // })
   // .then((response)=>{
        //console.log("before response");
   //     console.log(response);
        //console.log("response should be showing up");
   //     res.redirect('dashboard/clinic');
  //  })

        })
        .then((response)=>{
            console.log(response);
            res.redirect('dashboard/clinic');
        })
    } else { // for dose number 2
        //Axios post request
        axios.post('http://localhost:10050/clinicAdminSecondApproval', {},{
            // lotOne =
            headers: {  firstName: firstName,
                        lastName: lastName,
                        mfrName: mfrName,
                        firstDate: dateOne,
                        lotOne: lotOne,
                        secDate: dateTwo,
                        secLot: lotTwo,
                        username: req.session.username,
                        doseNumber: doseNumber
            },
            withCredentials: true


        })
        .then((response)=>{
            console.log(response);
            res.redirect('dashboard/clinic');
        })
    }

});

/************************************************************************************************
 *                          FUNCTIONS/METHODS
 ************************************************************************************************/



module.exports = router;
