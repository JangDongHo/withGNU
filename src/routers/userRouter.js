import express from "express";
import { logout } from "../controllers/usersController";

const userRouter = express.Router();

userRouter.get("/logout", logout);

export default userRouter;
