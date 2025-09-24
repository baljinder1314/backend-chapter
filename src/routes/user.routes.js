import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const routes = Router();

routes.route("/register").get(
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
// routes.get("/register", registerUser);

export default routes;
