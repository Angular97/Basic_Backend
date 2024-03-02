const express = require("express");
const registeruser = require("../controllers/user.controller");
const router = express.Router();

router.route("/register").post(registeruser);

module.exports = router;
