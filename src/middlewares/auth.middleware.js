import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandle } from "../utils/asycHandle.js";
import { User } from "../models/user.models.js";

export const varityJwt = asyncHandle(async (req, res, next) => {
  const token = req.cookies?.AccessToken;

  if (!token) {
    throw new ApiError(400, "Unautherized token");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(403, "Invalid user token");
  }

  req.user = user;
  next();
});
