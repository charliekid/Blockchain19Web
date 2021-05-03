/*
* Created by Jorge
*/
var express = require('express');
var router = express.Router();
var axios = require('axios');
const http = require('http');

/**
 * Gets the page so that a clinicAdmin can input vaccine information
 * If a patient already has it's first dose it will grab the information for the first dose
 * and prefill it out for the clinicAdmin
 * By Charlie Nguyen
 */
router.get('/:firstName/:lastName',  async function(req, res, next) {

    let numberOfDose;   // used to see if patient has previous information to prefill our form
    let firstLot;
    let firstManufacturer;
    let firstDate;

    // Grab the index of which the patients firstDose information maybe at.
    let index = await findIndexOfState(req.params.firstName, req.params.lastName);

    // Making a promise since we have to grab data from the last
    let myPromise = new Promise(  function(myResolve, myReject)  {
        // Call the corda project to get the information
        http.get("http://localhost:10050/transaction/list/Patient1", (resp) => {
            var data;
            var json;
            var result;
            console.log("We are in the http.get()");
            resp.on("data", (information) => {
                data += information;
            });
            resp.on("end", () => {
                try {
                    // Parsing data since there are extra values we dont need
                    var substring = data.substr(9, data.length);
                    substring = substring.replaceAll("@", "");
                    json = JSON.parse(substring);

                    numberOfDose = json.data[index].state.data.dose;

                    // Grab the info of the first vaccine
                    if(numberOfDose == 1) {
                        result = json.data[index].state.data.firstDoseDate;
                        firstDate = result.substr(0,10);
                        firstLot = json.data[index].state.data.firstDoseLot;
                        firstManufacturer = json.data[index].state.data.firstDoseManufacturer;
                        myResolve(numberOfDose);
                    }

                    // Render the page
                    if(numberOfDose > 0 ) {
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

                } catch (error) {
                    console.error(error);
                    console.error("error within clinicAdmin.js");
                    myReject("error");
                };
            });
        });
    });
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


    // for dose number 1
    if(doseNumber == 1) {

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

/**
 * This function is used to get the index of which the patients transaction information is located
 * @param firstName - first name of the patient
 * @param lastName - last name of the patient
 * @returns {Promise<unknown>} - the index of which the patients information lives in. It will return
 *                               null if the information does not exists.
 * By Charlie Nguyen
 */
function findIndexOfState(firstName, lastName) {
    var data;
    var json;
    return new Promise(function (resolve, reject) {
        http.get("http://localhost:10050/transaction/list/Patient1",(resp)=>{
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

                    // Find the index
                    var key;
                    for(key in json.data) {
                        if(json.data.hasOwnProperty(key)) {
                            if(json.data[key].state.data.firstName == firstName && json.data[key].state.data.lastName == lastName) {
                                resolve(key);
                            }
                        }
                    }
                }
                catch(err){
                    console.log(err);
                    reject(null);
                }
            });
        });
    });
}

module.exports = router;
