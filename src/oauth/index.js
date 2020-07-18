const passport = require("passport")
const facebookStrat = require("./facebook")
// const googleStrategyConfig = require("./google")

passport.use(facebookStrat)
// passport.use('google', googleStrategyConfig);
// refresh.use('google', googleStrategyConfig);

module.exports = passport