import express from "express";
import { placeScrap } from "../controllers/placesController";
import { checkLogin } from "../controllers/usersController";
import { protectorMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/checkLogin", checkLogin);
apiRouter.post("/places/:id([0-9a-f]{24})/scrap", placeScrap);

export default apiRouter;
