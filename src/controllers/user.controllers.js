import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandle } from "../utils/asycHandle.js";
import {
  deletePhotoOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true, // can’t be accessed by JS
  secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while generating refresh token and access token: ${error}`
    );
  }
};

export const registerUser = asyncHandle(async (req, res) => {
  const { username, email, fullName, password } = req.body;

  if (
    [username, email, fullName, password].some((input) => input?.trim() === "")
  ) {
    throw new ApiError(400, "each fields is required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User aleady exist");
  }

  const avatarLocalFilePath = req.files?.avatar?.[0]?.path;
  const coverImageLocalFilePath = req.files?.coverImage?.[0]?.path;

  let avatar = null;
  let coverImage = null;

  if (avatarLocalFilePath) {
    avatar = await uploadOnCloudinary(avatarLocalFilePath);
  } else {
    throw new ApiError(406, "Image is required to upload.");
  }
  if (coverImageLocalFilePath) {
    coverImage = await uploadOnCloudinary(coverImageLocalFilePath);
  }

  const user = await User.create({
    username,
    email,
    fullName,
    password,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    avatarPublicId: avatar?.public_id,
    coverImagePublicId: coverImage?.public_id,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User didn't create, server error! ");
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User created successfully!"));
});

export const loginUser = asyncHandle(async (req, res) => {
  // get Data from the user.
  // check user Already register or not.
  // check all field is required.
  //

  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new ApiError(405, "either Username or email is required");
  }
  const notRegister = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (notRegister === null) {
    throw new ApiError(400, "User is not Register exist.");
  }

  const correct = await notRegister.isPasswordCorrect(password);

  if (!correct) {
    throw new ApiError(402, "Password is incorrect.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    notRegister._id
  );

  const loggedInUser = await User.findById(notRegister._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "Successfuly Logged In"
      )
    );
});

export const loggedOut = asyncHandle(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("RefreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out successfuly "));
});

export const regenerateAccessAndRefreshToken = async (req, res) => {
  const incommingRefreshToken =
    req.cookies?.RefreshToken || req.body?.RefreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(400, "Unautherized token");
  }

  const decodedToken = jwt.verify(
    incommingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (incommingRefreshToken !== user.refreshToken) {
    throw new ApiError(405, "Invalid or Expired Token");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );

  res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
};

export const changePassword = asyncHandle(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(406, "Invalid old Password");
  }

  user.password = newPassword;
  user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed Successfuly"));
});

export const getCurrentUser = asyncHandle(async (req, res) => {
  if (!req.user) {
    throw new ApiError(400, "user Not Found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetched Successfuly"));
});

export const updateAccountDetails = asyncHandle(async (req, res) => {
  const { fullName, email } = req.body;

  if (!(fullName && email)) {
    throw new ApiError(406, "fullName and email is required");
  }
  const updatedFields = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  req
    .status(200)
    .json(
      new ApiResponse(200, updatedFields, "Fullname and email has been updated")
    );
});

export const updateUserAvatar = asyncHandle(async (req, res) => {
  const oldAvatarPublicId = req.user?.avatarPublicId;
  const oldcoverImagePublicId = req.user?.coverImagePublicId;

  if (!(oldAvatarPublicId && oldcoverImagePublicId)) {
    throw new ApiError(500, "Old Pics are deleted");
  }

  await deletePhotoOnCloudinary(oldAvatarPublicId);
  await deletePhotoOnCloudinary(oldcoverImagePublicId);

  const newAvatar = await uploadOnCloudinary(req.files?.avatar[0].path);
  const newCoverImage = await uploadOnCloudinary(req.files?.coverImage[0].path);

  if (!(newAvatar && newCoverImage)) {
    throw new ApiError(405, "twise are required");
  }

  const updateAvatar = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: newAvatar.url,
        coverImage: newCoverImage.url,
        avatarPublicId: newAvatar.public_id,
        coverImagePublicId: newCoverImage.public_id,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, updateAvatar, "Avatar Successfuly update"));
});
