import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

const routes = Router();

routes.route("/register").get(registerUser);

export default routes;
