var express = require("express");
var router = express.Router();
const {
  createUser,
  getMyProfile,
} = require("../src/controllers/userController");
const { loginRequired } = require("../src/middlewares/auth");
/* GET users listing. */
router.route("/")
  .get(function (req, res, next) {
    res.send('This is where you sign up for');
  })
  .post(createUser)


router.route("/me").get(loginRequired, getMyProfile);
module.exports = router;
