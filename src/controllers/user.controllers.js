import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandle } from "../utils/asycHandle.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
