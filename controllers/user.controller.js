// steps to register user

const user = require("../models/user.model");
const uploadOnCloudinary = require("../utils/cloudinary");

// get user details from frontend according to ours models
// then validation - not empty
// check if user already exist : username & email
// check for images , check for avatar
// upload them to cloudinary
// create user object : to create no sql data in db
// remove password and refresh toekn field from response
// check for user creation
// if user created return res or send error

const registeruser = async (req, res) => {
  const { username, email, fullName, password } = req.body;
  //console.log("username", username);

  if (fullName === "" || email === "" || password === "" || username === "")
    res.status(400).send("Field is required");

  const existed_user = await user.findOne({
    $or: [{ username }, { email }],
  });

  if (existed_user) res.status(403).send("Username or Email Already Exit");

  const avatarlocalpath = req.files?.avatar[0]?.path;
  //const coverimagelocalpath = req.files?.coverimage[0]?.path;
  let coverimagelocalpath = "";
  if (!avatarlocalpath)
    res.status(404).send("Avatar Path Not Found it's Required");

  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverimagelocalpath = req.files.coverimage[0].path;
  }

  const avatar = await uploadOnCloudinary(avatarlocalpath);
  const coverimage = await uploadOnCloudinary(coverimagelocalpath);

  if (!avatar) res.status(404).send("Avatar Not Found it's Required");

  // create data in DB
  const data = await user.create({
    email,
    fullName,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    password,
    username: username.toLowerCase(),
  });

  const created_data = await user
    .findById(data._id)
    .select("-password -refreshToken");

  if (!created_data)
    res.status(500).send("Something went wrong while registering the user");

  //console.log(req.files);

  // const data_object = data.toObject();
  // delete data_object.password;
  // delete data_object.refreshToken;

  return res.status(201).json({
    data: created_data,
    message: "User Registered Sucessfully",
  });
};

module.exports = registeruser;
