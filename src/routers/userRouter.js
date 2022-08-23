import express from "express";
import { logout, profile, editProfile } from "../controllers/usersController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.get("/:id([0-9a-f]{24})", protectorMiddleware, profile);
userRouter.route("/edit-profile").all(protectorMiddleware).get(editProfile);

export default userRouter;
