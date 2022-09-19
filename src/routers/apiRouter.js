import express from "express";
import {
  editComment,
  deleteComment,
  placeScrap,
} from "../controllers/placesController";
import { checkLogin } from "../controllers/usersController";
import {
  placeImgUpload,
  protectorMiddleware,
  deletePlaceImg,
  checkBannedMiddleware,
} from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/checkLogin", checkLogin);
apiRouter.post(
  "/places/:id([0-9a-f]{24})/scrap",
  checkBannedMiddleware,
  placeScrap
);
apiRouter
  .route("/comments/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .post(
    checkBannedMiddleware,
    placeImgUpload.fields([{ name: "commentImg", maxCount: 3 }]),
    editComment
  )
  .delete(deletePlaceImg, deleteComment);

export default apiRouter;
