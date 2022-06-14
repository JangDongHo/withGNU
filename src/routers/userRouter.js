import express from "express";
import { logout, profile } from "../controllers/usersController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/:id([0-9a-f]{24})", profile);

export default userRouter;
