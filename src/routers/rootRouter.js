import express from "express";
import { home, search } from "../controllers/placesController";
import {
  emailAuth,
  getJoin,
  getLogin,
  postLogin,
  privacyPolicy,
  servicePolicy,
} from "../controllers/usersController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter
  .route("/join")
  .all(publicOnlyMiddleware)
  .get(getJoin)
  .post(emailAuth);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);
rootRouter.get("/privacy-policy", privacyPolicy);
rootRouter.get("/service-policy", servicePolicy);

export default rootRouter;
