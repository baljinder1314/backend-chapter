import { Router } from "express";
import {
  loggedOut,
  loginUser,
  regenerateAccessAndRefreshToken,
  registerUser,
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
routes.route("/refresh-token").post(regenerateAccessAndRefreshToken)
export default routes;
