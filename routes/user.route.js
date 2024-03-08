const express = require("express");
const {
  registeruser,
  loginuser,
  logoutuser,
} = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");
const verifyToken = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/register").get((req, res) => {
  res.render("register");
});

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

router.route("/login").get((req, res) => {
  res.render("login");
});
router.route("/login").post(loginuser);

// Secure Routes
router.route("/logout").post(verifyToken, logoutuser);

module.exports = router;
