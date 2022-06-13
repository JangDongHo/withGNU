import express from "express";
import { home, search } from "../controllers/restaurantsController";
import {
  emailAuth,
  getJoin,
  getLogin,
  postLogin,
} from "../controllers/usersController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(emailAuth);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
