/*
* Created by Jorge
*/
const session = require('express-session');

var express = require('express');
var http = require('https');
var router = express.Router();
var axios = require('axios').default;



router.get('/', function(req,res,next){
    res.render('vaccineRegister');
});

router.post('/', function(req,res,next){
    var first = req.body.firstName;
    var last = req.body.lastName;
    var dose = 0;
    var username = req.session.username;
    var userString = JSON.stringify(username);
    var usrString = res.json(username);
    //console.log(userString);
        //Post request: sends user data to Spring controller
        axios.post('http://localhost:10050/registerVaccine',{},
        { params:{  firstName: first,lastName: last, dose: dose, user: usrString},
          withCredentials: true
        })
        //Server  successful response
        .then((response) => {
          //console.log("inside axios post call");
          //console.log(response[0].data);

          console.log(response);
          console.log(userString);
          console.log(usrString);
          //console.log(req.session.username);
          res.render('dashboards/patient-dashboard');
        })

            /*
            axios({
                method: 'post',
                url: 'http://localhost:10050/registerVaccine',
                data: {
                    firstName: first,
                    lastName: last,
                    dosage: 0,
                    /*
                    approvedForVaccination: null,
                    firstDoseDate: null,
                    firstDoseLot: '',
                    firstDoseManufacturer: '',
                    secondDoseDate: null,
                    secondDoseLot: '',
                    secondDoseManufacturer: '',
                    vaccinationProcessComplete: null,
                    //approvedForWork,
                    patientFullName: null,
                    doctor: null,
                    patientEmployer: null,
                    clinicAdmin: null

                }
            })
            .then((response) => {
               console.log("inside axios post call");

              console.log(response);
            }, (error) => {
              console.log(error);
            });*/
            //res.redirect('dashboard');

});





module.exports = router;
