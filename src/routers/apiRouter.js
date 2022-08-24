import express from "express";
import {
  editComment,
  deleteComment,
  placeScrap,
} from "../controllers/placesController";
import { checkLogin } from "../controllers/usersController";
import { placeImgUpload, protectorMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/checkLogin", checkLogin);
apiRouter.post("/places/:id([0-9a-f]{24})/scrap", placeScrap);
apiRouter
  .route("/comments/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .post(placeImgUpload.fields([{ name: "commentImg" }]), editComment)
  .delete(deleteComment);

export default apiRouter;
