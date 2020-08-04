var express = require("express");
var router = express.Router();
const {
  browseImage,
  uploadImage,
} = require("../src/controllers/memeController");
const upload = require("../src/utils/upload")
const {loadData,saveData} = require("../src/utils/upload")
const {loadMemeData,saveMemeData} = require("../src/utils/memesData")
const { loginRequired } = require("../src/middlewares/auth");

/* GET home page. */
router.route("/browse").get(browseImage);

router.route("/upload").post(upload, uploadImage)
module.exports = router;
