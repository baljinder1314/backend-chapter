import { ApiError } from "../utils/ApiError.js";
import { asyncHandle } from "../utils/asycHandle.js";

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
    throw new ApiError(400,"each fields is required" );
    // console.log("error");
  }

  
});
