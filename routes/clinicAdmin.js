/*
* Created by Jorge
*/
var express = require('express');
var router = express.Router();
var axios = require('axios');
const http = require('http');

/* GET: Renders clinicAdmin page. */
router.get('/', function(req, res, next) {
    res.render('clinicAdmin');
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
    req.session.username = "ClinicAdmin1";

    //Axios post request
    axios.post('http://localhost:10050/clinicAdminApproval', {},{
        headers: {firstName: firstName,lastName: lastName,mfrName: mfrName, firstDate: dateOne, lotOne: lotOne, secDate: dateTwo, secLot: lotTwo, username: req.session.username},
        withCredentials: true

    })
    .then((response)=>{
        console.log(response);
        res.redirect('dashboard/clinic');
    })


});

module.exports = router;
