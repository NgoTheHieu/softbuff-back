var express = require("express");
var router = express.Router();
const {
  loginWithEmail,
  loginFacebook,
} = require("../src/controllers/authController");
const { loginRequired } = require("../src/middlewares/auth");

router.route("/login/facebook").get(loginFacebook);
router.route("/login").post(loginWithEmail);

async function logout(req, res, next) {
  try {
      const token = req.headers.authorization.replace("Bearer ","")
      req.user.tokens = req.user.tokens.filter(el => el !== token)
      await req.user.save()
      res.status(204).end()
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "Fail", error: "Unauthorised" });
  }
}

router.route("/logout").get(loginRequired,logout)

module.exports = router;
