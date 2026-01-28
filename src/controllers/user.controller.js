import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploacOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//user-> pswd is correct then create access n refresh token
//creating a seperate method so, can reuse again n again
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //ref token save krwana h db me
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    //access token generate..
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //1. get user details from frontend
  //validation - not empty
  //check if user already exists : username, email
  //check for images, check for avatar
  //upload them to cloudinary, avatar
  //user data -> image li -> upload to cloudinary-> got img back from cloudinary
  //create user object- create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response res.

  //data is coming from body(via form), or by url
  //by body
  const { fullName, email, username, password } = req.body;
  console.log("email : ", email);
  //for file handling go to routes->multermiddleware
  //you can directly use multer ka storage
  //import upload to userroutes

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists! ");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploacOnCloudinary(avatarLocalPath);
  const coverImage = await uploacOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> bring your data
  // username or email
  //find the user
  //exists -> login -> pswd check
  //acces n refresh token
  //send cookie

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or password is not required");
  }

  //if the user is logged in we'll have username or email
  //findOne use
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  //in case user kabhi mila hi nahi
  if (!user) {
    throw new ApiError(404, "User does not exits");
  }

  //if user milgaya then password checck karna padega
  //

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  //user-> pswd is correct then create access n refresh token

  //creating a seperate method so, can reuse again n again
  //method above

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id,
  );

  //After this whenever loggedin User comes we have all teh remaining fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  //we have to send cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  //returning response

  return res
    .status(200) //done successfully
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200, //sucess
        {
          //data
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        //message
        "User logged in successfully",
      ),
    );
});

const logoutUSer = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out"))
  

});

export { registerUser, loginUser, logoutUSer };
