import express from "express";
import {
  logout,
  profile,
  getEditProfile,
  postEditProfile,
  getEditPassword,
  postEditPassword,
} from "../controllers/usersController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  avartarImgUpload,
  deleteAvatarImg,
  checkBannedMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.get("/:id([0-9a-f]{24})", profile);
userRouter
  .route("/edit-profile")
  .all(protectorMiddleware)
  .get(getEditProfile)
  .post(
    checkBannedMiddleware,
    avartarImgUpload,
    deleteAvatarImg,
    postEditProfile
  );
userRouter
  .route("/edit-password")
  .all(protectorMiddleware)
  .get(getEditPassword)
  .post(postEditPassword);

export default userRouter;
