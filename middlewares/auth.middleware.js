const jwt = require("jsonwebtoken");
const user = require("../models/user.model");

const verifyToken = async (req, res, next) => {
  //console.log(req.cookies);
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //console.log(req.cookies?.accessToken);

    if (!token) res.status(401).send("Unauthorized Token Request");

    const decodetoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const data = await user
      .findById(decodetoken?._id)
      .select("-password -refreshToken");

    if (!data) res.status(401).send("Invalid Token Access");

    //console.log(data);

    req.data = data; // adding new object req.data what ever you want to give name
    //console.log(req.data);
    next();
  } catch (error) {
    res.status(401).send(error?.message || "Invalid Token Access Catch");
  }
};

module.exports = verifyToken;
