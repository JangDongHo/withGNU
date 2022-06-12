import express from "express";
import { home, search } from "../controllers/restaurantsController";
import { emailAuth, getJoin, getLogin } from "../controllers/usersController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(emailAuth);
rootRouter.get("/login", getLogin);
rootRouter.get("/search", search);

export default rootRouter;
