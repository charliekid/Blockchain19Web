var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET clinicAdmin page. */
router.get('/', function(req, res, next) {
    res.render('clinicAdmin');
});

router.post('/', function(req,res,next){
    var data = req.body;
    var mfrName = data.mfrName;
    var dateOne = data.dateOne;
    var lotOne = data.lotNumberOne;
    var dateTwo = data.dateTwo;
    var lotTwo = data.lotNumberTwo;

    axios.post('http://localhost:10050/clinicAdminApproval', {},{
        headers: {mfrName: mfrName, firstDate: dateOne, lotOne: lotOne, secDate: dateTwo, secLot: lotTwo}

    })
    .then((response)=>{
        console.log(response);
        //res.redirect('/dashboard')
    })


});

module.exports = router;
