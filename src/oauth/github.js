var GitHubStrategy = require('passport-github').Strategy;
require("dotenv").config();

module.exports = new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/github/callback",
    profileFields:["id","email","password","photos"]
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
  
  }
);