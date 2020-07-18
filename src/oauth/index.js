const passport = require("passport")
const facebookStrat = require("./facebook")
const githubStrat = require("./github")
// const googleStrategyConfig = require("./google")

passport.use(facebookStrat)
passport.use(githubStrat)
// passport.use('google', googleStrategyConfig);
// refresh.use('google', googleStrategyConfig);

module.exports = passport