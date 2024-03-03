const express = require("express");
const registeruser = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");
const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  registeruser
);

module.exports = router;
