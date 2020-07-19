var express = require("express");
var router = express.Router();
const {
    getoauth_login
} = require("../src/controllers/authController");
const { loginRequired } = require("../src/middlewares/auth");
router.route("/").get(getoauth_login)
// router.route("/oauth_login/github")
// router.route("/oauth_login/github")

// router.route("/logout").get(loginRequired,logout)

module.exports = router;
