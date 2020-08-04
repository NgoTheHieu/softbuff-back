const multer = require("multer");
const path = require("path");
const { loadData } = require("./data");

const pathToUpload = path.join(__dirname, "../public/uploads/originals");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathToUpload);
  },
  filename: function (req, file, cb) {
    const allows = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
    if (!allows.includes(file.mimetype)) {
      let err = new Error("File type not allowed.");
      cb(err, undefined);
    }
    const data = loadData();
    console.log("File in upload.js", file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("fileUpload");

module.exports = upload;
