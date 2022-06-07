import express from "express";
import { home, search } from "../controllers/restaurantsController";
import { getJoin, getLogin } from "../controllers/usersController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/join", getJoin);
rootRouter.get("/login", getLogin);
rootRouter.get("/search", search);

export default rootRouter;
