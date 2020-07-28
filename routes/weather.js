var express = require('express');
var router = express.Router();

const getGeocode = require('../src/utils/geocode')
const getWeather = require('../src/utils/getWeather')
// const getCurrentLocation = require('../src/utils/getCurrentLocation')

router.get("/", (req,res)=>{
    const city = req.query.city
    if(!city){
        res.send({status:"Failed",message:"Please Input the City in"})
    }
    getGeocode(res,req.query.city,getWeather)
})

module.exports = router;