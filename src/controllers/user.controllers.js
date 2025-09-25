import { upload } from "../middlewares/multer.middleware.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandle } from "../utils/asycHandle.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = asyncHandle(async (req, res) => {
  // get user detail from frontend
  // Validation --not empty
  // Check if user already exist or not -- email , username
  // check for avatar || check for coverImage
  // upload them to cloudinary
  // Create user object - create entry in DB
  // remove password and refreshToken field from response
  // Check for user creation
  // returen res.

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

  
  const avatarLocalFilePath = req.files?.avatar[0]?.path;
  const converImageLocalFilePath = req.files?.coverImage[0]?.path;

  console.log({
    name: "local image path",
    1: avatarLocalFilePath,
    2: converImageLocalFilePath,
  });
  const avatar = await uploadOnCloudinary(avatarLocalFilePath);
  const converImage = await uploadOnCloudinary(converImageLocalFilePath);

  console.log({ 1: avatar, 2: converImage });
});
