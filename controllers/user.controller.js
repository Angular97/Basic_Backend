// steps to register user

const user = require("../models/user.model");
const uploadOnCloudinary = require("../utils/cloudinary");

const generatetokens = async (dataid) => {
  try {
    const data = await user.findById(dataid);
    const accessToken = data.generateAccessToken();
    const refreshToken = data.generateRefreshToken();

    data.refreshToken = refreshToken;
    await data.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new error();
  }
};

const registeruser = async (req, res) => {
  // get user details from frontend according to ours models
  // then validation - not empty
  // check if user already exist : username & email
  // check for images , check for avatar
  // upload them to cloudinary
  // create user object : to create no sql data in db
  // remove password and refresh toekn field from response
  // check for user creation
  // if user created return res or send error

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

const loginuser = async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, username, password } = req.body;

  console.log("here is username or email", email, username);

  if (!(username || email))
    res.status(400).send("username or email is required");

  const data = await user.findOne({
    $or: [{ username }, { email }],
  });

  if (!data)
    res.status(404).send("User Does Not Exist Please Register First !!");

  const checkpassword = await data.isPasswordCorrect(password);

  if (!checkpassword) res.status(401).send("Invalid Password");

  const { accessToken, refreshToken } = await generatetokens(data._id);

  const loggedInUser = await user
    .findById(data._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      data: loggedInUser,
      accessToken,
      refreshToken,
      message: "User Logged In Sucessfully",
    });
};

const logoutuser = async (req, res) => {
  // since for logout need data for a user to logout but in this logout user could not send anything
  // so in what basic we logout the user ,  idea is we create one auth middleware so when user login the profile
  // refersh & access token generate with the help of these token we can access the data & compare to our db and then
  // logout the user also delete the refresh token because session is done

  const logoutdata = await user.findByIdAndUpdate(
    req.data._id,
    {
      $set: {
        refreshToken: "", // this removes the field from documen
      },
    },
    {
      new: true, // send response with the updated data from db i.e we see the data with refreshtoken undefined
    }
  );

  const options = {
    httpOnly: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "User Logout Successfully",
    });
};

module.exports = { registeruser, loginuser, logoutuser };
