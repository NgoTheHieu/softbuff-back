const passportFacebook = require("passport-facebook");
const Strategy = passportFacebook.Strategy;
require("dotenv").config();

module.exports = new Strategy({
      // 1st arg is configuration (option)
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ["id", "email", "name", "photos"],
},
// verification function (callback) /auth/facebook/authorized
function(accessToken,refreshToken, profile,next){
    console.log(profile);
    next(null,profile)
});

