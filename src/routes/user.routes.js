import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

const routes = Router();

routes.route("/register").get(registerUser);
// routes.get("/register", registerUser);

export default routes;
