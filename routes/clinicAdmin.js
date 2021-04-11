var express = require('express');
var router = express.Router();
var axios = require('axios');
const http = require('http');

/* GET clinicAdmin page. */
router.get('/', function(req, res, next) {
    res.render('clinicAdmin');
});
router.get('/clinicAdmin', function(req,res,next){
    var data;
    var json;
    http.get("http://localhost:10050/transaction/list/"+req.session.username,(resp)=>{
        resp.on("data", (information) => {
          data += information;
        });
        resp.

    });

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
        res.redirect('dashboards/clinic-dashboard');
    })


});

module.exports = router;
