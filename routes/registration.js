var express = require('express');
var router = express.Router();

router.get('/', function(req,res,next){
    res.render('registration');
});


router.post('/',function(reg,res,next){

});

module.exports = router;
