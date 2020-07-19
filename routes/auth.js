var express = require("express");
var router = express.Router();
const {
  loginWithEmail,
  loginFacebook,
  loginGithub,logout
} = require("../src/controllers/authController");
const { loginRequired } = require("../src/middlewares/auth");
router.route("/login/facebook").get(loginFacebook);
router.route("/login").post(loginWithEmail);
// router.route("/oauth_login/github")
// router.route("/oauth_login/github")

router.route("/logout").get(loginRequired,logout)

module.exports = router;
