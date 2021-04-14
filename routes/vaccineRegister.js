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
    req.session.username = "Patient1";

    console.log("This is the session username: " + req.session.username);
    //console.log(userString);
        //Post request: sends user data to Spring controller
        axios.post('http://localhost:10050/registerVaccine',{},
        { headers:{firstName: first, lastName: last, dose: dose, username: req.session.username},
          withCredentials: true
        })
        //Server  successful response
        .then((response) => {
          //console.log("inside axios post call");
          //console.log(response[0].data);

          console.log(response);

          console.log(req.session.username);
          res.redirect('dashboard/patient');
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
