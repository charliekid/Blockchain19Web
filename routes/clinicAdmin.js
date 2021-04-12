var express = require('express');
var router = express.Router();
var axios = require('axios');
const http = require('http');

/* GET: Renders clinicAdmin page. */
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
        resp.on("end", ()=>{
          try{
            var substring = data.substr(9, data.length);
            substring = substring.replaceAll("@", "");
            console.log("\nsubstring = " + substring);
            json = JSON.parse(substring);

            console.log(json.data);
          }
          catch(err){
            console.log(err);
          }

        });

    });

});
//Post request to send vaccine info to Spring controller
router.post('/', function(req,res,next){
    var data = req.body;
    var mfrName = data.mfrName;
    var dateOne = data.dateOne;
    var lotOne = data.lotNumberOne;
    var dateTwo = data.dateTwo;
    var lotTwo = data.lotNumberTwo;
    //var user = req.session.username;

    //Axios post request
    axios.post('http://localhost:10050/clinicAdminApproval', {},{
        headers: {mfrName: mfrName, firstDate: dateOne, lotOne: lotOne, secDate: dateTwo, secLot: lotTwo},
        withCredentials: true;

    })
    .then((response)=>{
        console.log(response);
        res.redirect('dashboards/clinic-dashboard');
    })


});

module.exports = router;
