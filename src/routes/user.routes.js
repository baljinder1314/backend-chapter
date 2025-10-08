import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  loggedOut,
  loginUser,
  regenerateAccessAndRefreshToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varityJwt } from "../middlewares/auth.middleware.js";

const routes = Router();

routes.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
routes.route("/login").post(loginUser);

routes.route("/loggedOut").post(varityJwt, loggedOut);
routes.route("/refresh-token").post(regenerateAccessAndRefreshToken);
routes.route("/change-password").post(varityJwt, changePassword);
routes.route("/current-user").post(varityJwt, getCurrentUser);
routes.route("/updated-details").post(varityJwt, updateAccountDetails);
routes
  .route("/updated-avatar")
  .post(varityJwt, upload.single("avatar"), updateUserAvatar);

export default routes;
