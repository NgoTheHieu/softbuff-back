const request = require(`request`);

const getGeocode = (res, city, callback) => {
    try{
        const token = process.env.MAPBOX;
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          city
        )}.json?access_token=${token}`;
       console.log(url)
        request({ url: url, json: true }, (error, { body }) => {
          if (error) {
            return res.send({ error: "cannot find your location" });
          }
          console.log(`from geocode`, body);
          
          const [long, lat] = body.features[0].geometry.coordinates;
          callback(res, body.features[0].place_name, long, lat);
        })
    }

    catch(err){
        res.status(404).json({status:"Fail",error:err.message})
    }
;
};

module.exports = getGeocode;
